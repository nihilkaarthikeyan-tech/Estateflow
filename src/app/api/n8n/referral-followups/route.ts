import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily — returns leads that closed exactly 30 days ago,
// so we can ask the happy client for referrals (the best UAE lead source).
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Referral ask fires 30 days after the deal closed. closed_at is a timestamp,
  // so match the whole calendar day [day 00:00, next day 00:00).
  const start = new Date();
  start.setDate(start.getDate() - 30);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, location, property_type")
    .eq("status", "closed")
    .not("phone", "is", null)
    .is("referral_followup_sent_at", null)
    .gte("closed_at", start.toISOString())
    .lt("closed_at", end.toISOString());

  if (!leads || leads.length === 0) {
    return NextResponse.json({ leads: [], count: 0 });
  }

  return NextResponse.json({ leads, count: leads.length });
}
