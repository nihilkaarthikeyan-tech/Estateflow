import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendLeadNotificationEmail } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField, isValidPhone, isValidEmail } from "@/lib/sanitize";

const SYSTEM_PROMPT = `You are a real estate lead analyst. Extract structured information from the customer's message.

Return ONLY valid JSON with exactly these fields:
- summary: A concise, professional one-sentence summary of the customer's requirement
- budget: The budget mentioned (e.g. "₹90 Lakhs", "2 Crore") or null if not mentioned
- location: The preferred city or area or null
- property_type: The type of property (e.g. "3BHK Apartment", "Villa") or null
- urgency: One of "high", "medium", or "low" based on language urgency cues
- buyer_intent: One of "serious", "researching", or "comparing" based on commitment signals`;

export async function POST(req: NextRequest) {
  // 10 lead submissions per 10 minutes per IP — blocks form spammers
  const { allowed } = rateLimit(`lead-webhook:${getIP(req)}`, 10, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Sanitize all inputs
    const name        = sanitizeField(body.name, 150) || "Unknown";
    const phone       = sanitizeField(body.phone, 20);
    const email       = sanitizeField(body.email, 200);
    const raw_message = sanitizeField(body.raw_message, 2000);
    const source      = sanitizeField(body.source, 50) || "web_form";
    const webhook_secret = typeof body.webhook_secret === "string" ? body.webhook_secret : "";

    // Webhook secret check — only enforce if WEBHOOK_SECRET is set in env
    const configuredSecret = process.env.WEBHOOK_SECRET;
    if (configuredSecret && webhook_secret !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!raw_message) {
      return NextResponse.json({ error: "raw_message is required" }, { status: 400 });
    }

    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const leadPayload: Record<string, unknown> = {
      name,
      phone: phone || null,
      email: email || null,
      raw_message,
      source,
      status: "new",
      urgency: "medium",
      buyer_intent: "researching",
      ai_analyzed: false,
    };

    let extractedSummary: string | null = null;
    let extractedPropertyType: string | null = null;
    let extractedLocation: string | null = null;

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Customer message: "${raw_message}"` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const extracted = JSON.parse(completion.choices[0].message.content ?? "{}");
        const validUrgency = ["high", "medium", "low"];
        const validIntent  = ["serious", "researching", "comparing"];

        extractedSummary      = extracted.summary ?? null;
        extractedPropertyType = extracted.property_type ?? null;
        extractedLocation     = extracted.location ?? null;

        Object.assign(leadPayload, {
          summary:      extractedSummary,
          budget:       extracted.budget ?? null,
          location:     extractedLocation,
          property_type: extractedPropertyType,
          urgency:      validUrgency.includes(extracted.urgency) ? extracted.urgency : "medium",
          buyer_intent: validIntent.includes(extracted.buyer_intent) ? extracted.buyer_intent : "researching",
          ai_analyzed:  true,
        });
      } catch {
        // AI analysis failed — store lead without AI fields
      }
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadPayload)
      .select()
      .single();

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    // Auto-reply welcome message
    const leadFirstName  = name.split(" ")[0];
    const propertyRef    = extractedPropertyType ?? "property";
    const locationRef    = extractedLocation ? ` in ${extractedLocation}` : "";
    const welcomeMessage = `Hi ${leadFirstName}, thank you for your enquiry about ${propertyRef}${locationRef}. Our team will review your requirement and get back to you shortly with suitable options.`;

    await supabase.from("conversations").insert({
      lead_id: lead.id,
      message: welcomeMessage,
      direction: "outbound",
    });

    // Auto property matching in background
    if (lead.id) {
      (async () => {
        try {
          let propQuery = supabase
            .from("properties")
            .select("id, title, price, location, city, bedrooms, property_type, images")
            .eq("status", "available")
            .limit(20);
          if (extractedLocation) {
            const keyword = extractedLocation.split(",")[0].trim();
            propQuery = propQuery.or(`location.ilike.%${keyword}%,city.ilike.%${keyword}%`);
          }
          const { data: props } = await propQuery;
          if (props && props.length > 0) {
            const top3     = props.slice(0, 3);
            const matchMsg = `🏠 Top matching properties for your requirement:\n${top3.map((p, i) => `${i + 1}. ${p.title} — ₹${Number(p.price).toLocaleString("en-IN")} (${p.city ?? p.location})`).join("\n")}`;
            await supabase.from("conversations").insert({ lead_id: lead.id, message: matchMsg, direction: "outbound" });
          }
        } catch { /* silent */ }
      })();
    }

    // In-app notifications
    const { data: users } = await supabase.from("profiles").select("id");
    if (users && users.length > 0) {
      const urgencyFlag   = leadPayload.urgency === "high" ? " 🔴 HIGH URGENCY" : "";
      const notifications = users.map((user) => ({
        user_id: user.id,
        message: `New lead received: ${name}${urgencyFlag} — "${raw_message.slice(0, 80)}${raw_message.length > 80 ? "…" : ""}"`,
        type: "lead",
        link: `/dashboard/leads/${lead.id}`,
        read: false,
      }));
      await supabase.from("notifications").insert(notifications);

      // Email notification via Resend
      if (process.env.RESEND_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const serviceClient    = createServiceClient(process.env.NEXT_PUBLIC_SB_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
          const userIds          = users.map((u) => u.id);
          const { data: authUsers } = await serviceClient.auth.admin.listUsers();
          const userEmails       = authUsers?.users
            .filter((u) => userIds.includes(u.id) && u.email)
            .map((u) => u.email as string) ?? [];

          await Promise.all(
            userEmails.map((userEmail) =>
              sendLeadNotificationEmail(
                userEmail,
                name,
                extractedSummary ?? raw_message.slice(0, 120),
                lead.id
              )
            )
          );
        } catch { /* Email failure must never crash the webhook */ }
      }
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
