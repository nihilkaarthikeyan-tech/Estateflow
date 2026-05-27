import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  // 10 lookups per 5 minutes per IP — prevents phone-number enumeration
  const { allowed } = rateLimit(`tenant-lookup:${getIP(req)}`, 10, 5 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  // Basic phone validation — reject obviously bad input
  const cleaned = phone.replace(/\s+/g, "").replace(/^\+91/, "");
  if (!/^[0-9]{8,12}$/.test(cleaned)) {
    return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, name, email, phone, unit_number, status, property_id")
    .or(`phone.eq.${phone},phone.eq.+91${cleaned},phone.eq.${cleaned}`)
    .single();

  if (!tenant) {
    // Use generic message to avoid confirming whether a phone exists
    return NextResponse.json(
      { error: "No tenant found with this phone number." },
      { status: 404 }
    );
  }

  // Get lease
  const { data: lease } = await supabase
    .from("leases")
    .select("start_date, end_date, monthly_rent, status")
    .eq("tenant_id", tenant.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get maintenance tickets (only fields tenant needs to see)
  const { data: tickets } = await supabase
    .from("maintenance_tickets")
    .select("id, title, status, priority, created_at")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get linked property (only public-safe fields)
  const property = tenant.property_id
    ? (
        await supabase
          .from("properties")
          .select("title, location, city")
          .eq("id", tenant.property_id)
          .single()
      ).data
    : null;

  return NextResponse.json({
    tenant,
    lease: lease ?? null,
    tickets: tickets ?? [],
    property,
  });
}
