import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily to get leads that need a follow-up message sent today
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Days since last outbound message before we follow up, per stage
  const followupDays: Record<string, number> = {
    new: 1,
    contacted: 3,
    qualified: 7,
    site_visit: 3,
    negotiation: 2,
  };

  const results: unknown[] = [];

  for (const [stage, days] of Object.entries(followupDays)) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    // Get leads in this stage that have no outbound conversation since cutoff
    const { data: leads } = await supabase
      .from("leads")
      .select("id, name, phone, budget, location, property_type, urgency, summary, status, organization_id")
      .eq("status", stage)
      .not("phone", "is", null)
      .lt("created_at", cutoff.toISOString());

    if (!leads || leads.length === 0) continue;

    for (const lead of leads) {
      // Check last outbound conversation date
      const { data: lastMsg } = await supabase
        .from("conversations")
        .select("created_at")
        .eq("lead_id", lead.id)
        .eq("direction", "outbound")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const lastMsgDate = lastMsg?.created_at ? new Date(lastMsg.created_at) : null;
      const needsFollowup = !lastMsgDate || lastMsgDate < cutoff;

      if (needsFollowup) {
        results.push(lead);
      }
    }
  }

  return NextResponse.json({ leads: results, count: results.length });
}
