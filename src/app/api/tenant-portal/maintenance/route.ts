import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField } from "@/lib/sanitize";

const VALID_CATEGORIES = ["general", "plumbing", "electrical", "carpentry", "cleaning", "security"];

export async function POST(req: NextRequest) {
  // 5 tickets per 10 minutes per IP — prevents ticket spam
  const { allowed } = rateLimit(`tenant-maint:${getIP(req)}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const tenant_id = sanitizeField(body.tenant_id, 50);
    const title      = sanitizeField(body.title, 200);
    const description = sanitizeField(body.description, 1000);
    const category   = sanitizeField(body.category, 30);

    if (!tenant_id || !title) {
      return NextResponse.json(
        { error: "tenant_id and title required" },
        { status: 400 }
      );
    }

    // Validate category against allowlist
    const safeCategory = VALID_CATEGORIES.includes(category) ? category : "general";

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // SECURITY: Verify the tenant actually exists before creating a ticket
    // This prevents anyone with a random UUID from creating tickets
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, property_id, status")
      .eq("id", tenant_id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Only allow active tenants to submit tickets
    if (tenant.status === "inactive") {
      return NextResponse.json(
        { error: "Inactive tenants cannot submit maintenance requests." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("maintenance_tickets")
      .insert({
        tenant_id,
        property_id: tenant.property_id ?? null,
        title,
        description: description || null,
        category: safeCategory,
        status: "open",
        priority: "medium",
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
          message: `New maintenance request from tenant: "${title}"`,
          type: "info",
          link: `/dashboard/maintenance`,
          read: false,
        }))
      );
    }

    return NextResponse.json({ success: true, ticket: data }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
