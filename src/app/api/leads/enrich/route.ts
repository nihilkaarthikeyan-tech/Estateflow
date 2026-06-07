import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Enriches a MANUALLY-added lead (e.g. a lead an agent took on a phone call)
// so it gets the same treatment as a web/WhatsApp lead: an AI summary, the
// Golden Visa auto-flag, and a first-touch follow-up message — WITHOUT
// overwriting any structured fields the agent already filled in by hand.

const SYSTEM_PROMPT = `You are a real estate lead analyst. Extract structured information from the customer's message.

Return ONLY valid JSON with exactly these fields:
- summary: A concise, professional one-sentence summary of the customer's requirement
- budget: The budget mentioned (e.g. "AED 2.5M", "AED 1.6 Million") or null if not mentioned
- budget_aed: The budget as a plain AED number (e.g. 2500000) or null. Convert units (M/million, K) to a full number.
- location: The preferred city or area (e.g. "Dubai Marina", "Arabian Ranches") or null
- property_type: The type of property (e.g. "2BHK Apartment", "Villa", "Off-plan") or null
- Return null for fields you cannot extract — do not guess`;

// Parse a free-text AED budget ("AED 2.5M", "2,500,000", "1.6 million") to a number.
function parseAed(input?: string | null): number | null {
  if (!input) return null;
  const str = String(input).toLowerCase().replace(/aed|,|\s/g, "");
  const m = str.match(/([\d.]+)\s*(million|m|k)?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  if (m[2] === "million" || m[2] === "m") return n * 1_000_000;
  if (m[2] === "k") return n * 1_000;
  return n;
}

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();
    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    // Dashboard-only endpoint — require a logged-in agent.
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Service role for the writes (notifications/conversations across all users).
    const db = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: lead, error: loadErr } = await db
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (loadErr || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Already enriched (e.g. duplicate call) — return as-is.
    if (lead.ai_analyzed) {
      return NextResponse.json({ lead });
    }

    const update: Record<string, unknown> = { ai_analyzed: true };
    let aiBudgetAed: number | null = null;

    // AI pass — only if there's something to analyse and a key is configured.
    if (lead.raw_message && process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Customer message: "${lead.raw_message}"` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });
        const ai = JSON.parse(completion.choices[0].message.content ?? "{}");

        // Summary is AI's domain — agents rarely write one.
        if (ai.summary) update.summary = ai.summary;
        // Fill structured fields ONLY where the agent left them blank.
        if (ai.budget && !lead.budget) update.budget = ai.budget;
        if (ai.location && !lead.location) update.location = ai.location;
        if (ai.property_type && !lead.property_type) update.property_type = ai.property_type;

        aiBudgetAed = typeof ai.budget_aed === "number" ? ai.budget_aed : Number(ai.budget_aed);
      } catch {
        // AI failed — still apply the deterministic Golden Visa flag below.
      }
    }

    // UAE Golden Visa threshold is AED 2M. Compute from AI, else from the
    // budget the agent typed. Deterministic, never overrides a true flag.
    const budgetAed =
      (Number.isFinite(aiBudgetAed as number) ? (aiBudgetAed as number) : null) ??
      parseAed(lead.budget);
    if (budgetAed !== null && budgetAed >= 2_000_000) {
      update.golden_visa = true;
    }

    const { data: updated, error: updErr } = await db
      .from("leads")
      .update(update)
      .eq("id", leadId)
      .select()
      .single();

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // First-touch follow-up — same as a web lead. n8n picks outbound messages
    // up and delivers them on WhatsApp.
    const firstName = (updated.name ?? "there").split(" ")[0];
    const propRef = updated.property_type ?? "property";
    const locRef = updated.location ? ` in ${updated.location}` : "";
    await db.from("conversations").insert({
      lead_id: leadId,
      message: `Hi ${firstName}, thanks for speaking with us about ${propRef}${locRef}. I'll follow up shortly with options that match what you're looking for.`,
      direction: "outbound",
    });

    // Notify the team, same as the web webhook.
    const { data: profiles } = await db.from("profiles").select("id");
    if (profiles && profiles.length > 0) {
      const flag = updated.golden_visa ? " 👑 GOLDEN VISA" : "";
      await db.from("notifications").insert(
        profiles.map((p) => ({
          user_id: p.id,
          message: `New lead added: ${updated.name}${flag} (${updated.source ?? "manual"})`,
          type: "lead",
          link: `/dashboard/leads/${leadId}`,
          read: false,
        }))
      );
    }

    return NextResponse.json({ lead: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
