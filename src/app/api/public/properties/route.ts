import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function GET(req: Request) {
  // 60 requests per minute per IP — generous for a public listing feed
  const { allowed } = rateLimit(`pub-props:${getIP(req)}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Use the anon key — public data, no need for service-role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.NEXT_PUBLIC_SB_ANON_KEY!
  );

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, location, city, price, bedrooms, property_type")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ properties: properties ?? [] });
}
