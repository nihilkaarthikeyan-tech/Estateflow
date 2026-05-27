import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIP } from "@/lib/rate-limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message { role: "user" | "assistant"; content: string; }

export async function POST(req: NextRequest) {
  // 30 messages per minute per IP — generous for real chat, blocks scrapers
  const { allowed } = rateLimit(`chat:${getIP(req)}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Cap message length
    const safeMessage = message.slice(0, 1000);

    // Cap conversation history depth to prevent token abuse
    const safeHistory = (conversationHistory as Message[]).slice(-10);

    let propertyContext = "";
    try {
      const supabase = await createClient();
      const { data: properties } = await supabase
        .from("properties")
        .select("title, description, price, city, area, bedrooms, bathrooms, property_type, status")
        .eq("status", "available")
        .limit(20);

      if (properties && properties.length > 0) {
        propertyContext = `\n\nAvailable Properties:\n${properties
          .map((p) => `- ${p.title} (${p.property_type}) in ${p.city}${p.area ? ", " + p.area : ""}: ₹${Number(p.price).toLocaleString()}, ${p.bedrooms ?? "?"}BR/${p.bathrooms ?? "?"}BA`)
          .join("\n")}`;
      }
    } catch { /* silently skip if property fetch fails */ }

    const systemPrompt = `You are EstateFlow AI, a helpful real estate assistant. You help prospective buyers and renters explore properties, understand pricing, and book site visits.

Your capabilities:
- Answer questions about available properties, pricing, locations, and amenities
- Help users find properties matching their requirements
- Explain the buying/rental process in India
- Calculate loan EMI and check affordability
- Schedule or suggest site visits

Loan/EMI calculation rules:
- Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
- Default: 20% down payment, 8.5% annual interest, 20 year tenure
- Always show: loan amount, monthly EMI, total interest, total payment

Guidelines:
- Be concise, friendly, and professional
- Use Indian rupee (₹) for prices
- If you recommend a site visit or booking, end your message with: [ACTION:book_visit]
- Don't make up property details not in the provided list${propertyContext}`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...safeHistory.map((m: Message) => ({ role: m.role, content: m.content })),
      { role: "user", content: safeMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", messages, max_tokens: 400, temperature: 0.7,
    });

    const rawReply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process your request.";
    const hasAction = rawReply.includes("[ACTION:book_visit]");
    const reply = rawReply.replace("[ACTION:book_visit]", "").trim();

    return NextResponse.json({ reply, action: hasAction ? "book_visit" : undefined });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
