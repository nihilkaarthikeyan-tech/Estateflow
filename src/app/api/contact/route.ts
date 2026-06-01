import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, agency, message } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to Supabase
    await supabaseAdmin.from("demo_requests").insert({
      name,
      email,
      phone,
      agency: agency || null,
      message: message || null,
      created_at: new Date().toISOString(),
    });

    // Send email notification via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const html = `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f13; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <div style="margin-bottom: 24px;">
            <span style="background: #c9a96e; color: #0d0f0e; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">New Demo Request</span>
          </div>
          <h2 style="margin: 0 0 20px; font-size: 22px; color: #f1f5f9;">${name}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 100px;">Agency</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${agency || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Phone</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${email}</td></tr>
            ${message ? `<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${message}</td></tr>` : ""}
          </table>
          <a href="https://wa.me/${phone.replace(/\D/g, "")}" style="display: inline-block; background: #25d366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 12px;">WhatsApp →</a>
          <a href="mailto:${email}" style="display: inline-block; background: #c9a96e; color: #0d0f0e; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply by Email →</a>
          <p style="margin: 24px 0 0; color: #475569; font-size: 12px;">EstateFlow · New demo request from your landing page</p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "EstateFlow <onboarding@resend.dev>",
          to: "nihilkaarthikeyan@gmail.com",
          subject: `Demo request: ${name}${agency ? ` — ${agency}` : ""}`,
          html,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
