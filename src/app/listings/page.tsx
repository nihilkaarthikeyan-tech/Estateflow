import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Property } from "@/types";
import { BedDouble, Bath, Maximize2, MapPin, Search } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

function formatPrice(price: number) {
  if (price >= 1e7) return `₹${(price / 1e7).toFixed(price % 1e7 === 0 ? 0 : 2)} Cr`;
  if (price >= 1e5) return `₹${(price / 1e5).toFixed(price % 1e5 === 0 ? 0 : 1)}L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

const typeLabel: Record<string, string> = {
  apartment: "Apartment", villa: "Villa", independent_house: "Independent House",
  plot: "Plot", commercial: "Commercial", studio: "Studio",
};

interface SearchParams {
  city?: string;
  type?: string;
  beds?: string;
  max_price?: string;
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (params.city) query = query.ilike("city", `%${params.city}%`);
  if (params.type) query = query.eq("property_type", params.type);
  if (params.beds) query = query.gte("bedrooms", Number(params.beds));
  if (params.max_price) query = query.lte("price", Number(params.max_price));

  const { data: properties } = await query.limit(48);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[var(--foreground)]">
            <span className="text-[var(--accent)]">Estate</span>Flow
          </Link>
          <Link
            href="/submit-lead"
            className="bg-[var(--accent)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit Enquiry
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Available Properties</h1>
          <p className="text-[var(--foreground-muted)] text-sm">
            {properties?.length ?? 0} properties available
          </p>
        </div>

        {/* Filters */}
        <form method="GET" className="mb-8">
          <div className="flex flex-wrap gap-3 items-end bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-xs text-[var(--foreground-muted)] font-medium">City</label>
              <input
                name="city"
                defaultValue={params.city ?? ""}
                placeholder="Chennai, Bangalore…"
                className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs text-[var(--foreground-muted)] font-medium">Property Type</label>
              <select
                name="type"
                defaultValue={params.type ?? ""}
                className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">All Types</option>
                {Object.entries(typeLabel).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[110px]">
              <label className="text-xs text-[var(--foreground-muted)] font-medium">Min Bedrooms</label>
              <select
                name="beds"
                defaultValue={params.beds ?? ""}
                className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs text-[var(--foreground-muted)] font-medium">Max Price (₹)</label>
              <input
                name="max_price"
                type="number"
                defaultValue={params.max_price ?? ""}
                placeholder="e.g. 10000000"
                className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[var(--accent)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity h-[38px]"
            >
              <Search size={14} /> Search
            </button>
            {(params.city || params.type || params.beds || params.max_price) && (
              <Link
                href="/listings"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors h-[38px] flex items-center"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Property Grid */}
        {!properties || properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--foreground-muted)] mb-4">No properties match your search.</p>
            <Link href="/listings" className="text-[var(--accent)] text-sm hover:underline">Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(properties as Property[]).map((property) => (
              <div
                key={property.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/40 hover:shadow-lg transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-video bg-[var(--surface-2)] overflow-hidden">
                  {property.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground-subtle)] text-xs">
                      No photo
                    </div>
                  )}
                  {property.property_type && (
                    <span className="absolute top-3 left-3 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {typeLabel[property.property_type] ?? property.property_type}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] mb-3">
                    <MapPin size={11} />
                    {property.location}{property.city ? `, ${property.city}` : ""}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)] mb-4">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1"><BedDouble size={11} /> {property.bedrooms} Beds</span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1"><Bath size={11} /> {property.bathrooms} Baths</span>
                    )}
                    {property.area > 0 && (
                      <span className="flex items-center gap-1"><Maximize2 size={11} /> {property.area.toLocaleString()} sqft</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--accent)]">{formatPrice(property.price)}</span>
                    <Link
                      href={`/submit-lead?property=${encodeURIComponent(property.title)}`}
                      className="text-xs font-semibold bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ChatWidget />

      {/* Footer CTA */}
      <footer className="border-t border-[var(--border)] mt-16 py-10 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[var(--foreground-muted)] text-sm mb-4">
            Can&apos;t find what you&apos;re looking for? Tell us your requirement and we&apos;ll find the right property for you.
          </p>
          <Link
            href="/submit-lead"
            className="inline-block bg-[var(--accent)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Submit Your Requirement
          </Link>
        </div>
      </footer>
    </div>
  );
}
