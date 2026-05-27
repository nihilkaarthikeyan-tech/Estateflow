import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField, isValidPhone } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  // 5 bookings per 10 minutes per IP — prevents spam flooding
  const { allowed } = rateLimit(`book-visit:${getIP(req)}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Sanitize all string inputs
    const visitor_name  = sanitizeField(body.visitor_name, 100);
    const visitor_phone = sanitizeField(body.visitor_phone, 20);
    const visitor_email = sanitizeField(body.visitor_email, 200);
    const property_id   = sanitizeField(body.property_id, 50);
    const visit_date    = sanitizeField(body.visit_date, 20);
    const visit_time    = sanitizeField(body.visit_time, 10);

    if (!visitor_name || !visitor_phone || !visit_date) {
      return NextResponse.json(
        { error: "Name, phone and date are required." },
        { status: 400 }
      );
    }

    if (!isValidPhone(visitor_phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (visit_date < today) {
      return NextResponse.json(
        { error: "Visit date cannot be in the past." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: visit, error } = await supabase
      .from("visits")
      .insert({
        property_id: property_id || null,
        visitor_name,
        visitor_phone,
        visitor_email: visitor_email || null,
        visit_date,
        visit_time: visit_time || "10:00",
        status: "scheduled",
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
          message: `New site visit booked: ${visitor_name} (${visitor_phone}) on ${visit_date} at ${visit_time}`,
          type: "info",
          link: `/dashboard/visits`,
          read: false,
        }))
      );
    }

    // Trigger n8n visit confirmation webhook if configured
    if (process.env.N8N_VISIT_CONFIRMATION_WEBHOOK) {
      fetch(process.env.N8N_VISIT_CONFIRMATION_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visit, visitor_name, visitor_phone, visit_date, visit_time }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
