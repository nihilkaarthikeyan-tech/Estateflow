import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily — returns off-plan installments due in exactly 7 days
// that are still pending and haven't already had a reminder sent.
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Reminder fires 7 days before the installment is due.
  const target = new Date();
  target.setDate(target.getDate() + 7);
  const dueDate = target.toISOString().split("T")[0];

  const { data: schedules } = await supabase
    .from("payment_schedules")
    .select(
      "id, buyer_name, buyer_phone, project_name, developer, installment_label, amount, due_date, bank_details"
    )
    .eq("status", "pending")
    .eq("due_date", dueDate)
    .is("reminder_sent_at", null)
    .not("buyer_phone", "is", null);

  if (!schedules || schedules.length === 0) {
    return NextResponse.json({ installments: [], count: 0 });
  }

  return NextResponse.json({ installments: schedules, count: schedules.length });
}
