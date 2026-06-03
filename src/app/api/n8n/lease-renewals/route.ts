import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily — returns active leases that expire in exactly 90 days,
// so the tenant can be asked to renew and the listing agent notified.
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Alert fires 90 days before the lease ends.
  const target = new Date();
  target.setDate(target.getDate() + 90);
  const expiryDate = target.toISOString().split("T")[0];

  const { data: leases } = await supabase
    .from("leases")
    .select(`
      id, end_date, monthly_rent,
      tenants (id, name, phone, email, unit_number),
      properties (id, title, city, location, created_by)
    `)
    .eq("status", "active")
    .eq("end_date", expiryDate);

  if (!leases || leases.length === 0) {
    return NextResponse.json({ renewals: [], count: 0 });
  }

  const renewals = leases
    .map((lease) => {
      const tenant = Array.isArray(lease.tenants) ? lease.tenants[0] : lease.tenants;
      const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;
      return {
        lease_id: lease.id,
        end_date: lease.end_date,
        monthly_rent: lease.monthly_rent,
        tenant_name: tenant?.name ?? "Tenant",
        tenant_phone: tenant?.phone ?? null,
        tenant_email: tenant?.email ?? null,
        unit_number: tenant?.unit_number ?? null,
        property_title: property?.title ?? null,
        property_city: property?.city ?? property?.location ?? null,
        agent_user_id: property?.created_by ?? null,
      };
    })
    .filter((r) => r.tenant_phone);

  return NextResponse.json({ renewals, count: renewals.length });
}
