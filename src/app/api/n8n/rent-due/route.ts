import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily — returns tenants whose rent is due in the next 3 days
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  const todayDay = today.getDate();

  // Rent is due 3 days from now — check if today+3 matches the lease start day
  const targetDay = new Date();
  targetDay.setDate(today.getDate() + 3);
  const dueDay = targetDay.getDate();

  // Get all active leases
  const { data: leases } = await supabase
    .from("leases")
    .select(`
      id, monthly_rent, start_date, end_date, deposit,
      tenants (id, name, phone, email, unit_number)
    `)
    .eq("status", "active")
    .not("tenants", "is", null);

  if (!leases || leases.length === 0) {
    return NextResponse.json({ reminders: [], count: 0 });
  }

  const reminders = leases
    .filter((lease) => {
      const startDay = new Date(lease.start_date).getDate();
      return startDay === dueDay;
    })
    .map((lease) => {
      const tenant = Array.isArray(lease.tenants) ? lease.tenants[0] : lease.tenants;
      return {
        lease_id: lease.id,
        monthly_rent: lease.monthly_rent,
        due_date: targetDay.toISOString().split("T")[0],
        tenant_name: tenant?.name ?? "Tenant",
        tenant_phone: tenant?.phone ?? null,
        tenant_email: tenant?.email ?? null,
        unit_number: tenant?.unit_number ?? null,
      };
    })
    .filter((r) => r.tenant_phone);

  return NextResponse.json({ reminders, count: reminders.length });
}
