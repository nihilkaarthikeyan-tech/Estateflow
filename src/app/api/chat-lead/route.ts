import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField, isValidPhone } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  // 5 chat-lead captures per 10 minutes per IP
  const { allowed } = rateLimit(`chat-lead:${getIP(req)}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await req.json();

    const name               = sanitizeField(body.name, 150);
    const phone              = sanitizeField(body.phone, 20);
    const conversationSummary = sanitizeField(body.conversationSummary, 1000);

    if (!name || !phone) {
      return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }

    const supabase = await createClient();
    const raw_message = conversationSummary || `Chat lead: ${name}, ${phone}`;

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        raw_message,
        source: "ai_chat",
        status: "new",
        urgency: "medium",
        buyer_intent: "researching",
        ai_analyzed: false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify owner
    const { data: users } = await supabase.from("profiles").select("id");
    if (users && users.length > 0) {
      await supabase.from("notifications").insert(
        users.map((u) => ({
          user_id: u.id,
          message: `New chat lead: ${name} — requested a site visit`,
          type: "lead",
          link: `/dashboard/leads/${lead.id}`,
          read: false,
        }))
      );
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
