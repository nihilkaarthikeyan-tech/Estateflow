"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Property, PropertyStatus } from "@/types";

interface PropertyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Property, "id" | "created_at">) => Promise<{ error?: string }>;
  initial?: Property | null;
}

const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
  { label: "Upcoming", value: "upcoming" },
];

const typeOptions = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Independent House", value: "independent_house" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Studio", value: "studio" },
];

const furnishingOptions = [
  { label: "Fully Furnished", value: "fully_furnished" },
  { label: "Semi Furnished", value: "semi_furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

const amenityOptions = [
  "Swimming Pool", "Gym", "Parking", "Security",
  "Power Backup", "Lift", "Club House", "Garden",
  "CCTV", "Play Area", "Jogging Track", "Intercom",
];

const blank = {
  title: "",
  price: 0,
  location: "",
  city: "",
  description: "",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  amenities: [] as string[],
  images: [] as string[],
  videos: [] as string[],
  status: "available" as PropertyStatus,
  property_type: "",
  furnishing: "",
  tour_url: "",
  created_by: "",
};

export default function PropertyFormModal({ open, onClose, onSubmit, initial }: PropertyFormModalProps) {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatingDesc, setGeneratingDesc] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        price: initial.price,
        location: initial.location,
        city: initial.city ?? "",
        description: initial.description ?? "",
        bedrooms: initial.bedrooms,
        bathrooms: initial.bathrooms,
        area: initial.area ?? 0,
        amenities: initial.amenities ?? [],
        images: initial.images ?? [],
        videos: initial.videos ?? [],
        status: initial.status,
        property_type: initial.property_type ?? "",
        furnishing: initial.furnishing ?? "",
        tour_url: initial.tour_url ?? "",
        created_by: initial.created_by ?? "",
      });
    } else {
      setForm(blank);
    }
    setError("");
  }, [initial, open]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }));

  function toggleAmenity(a: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  }

  async function generateDescription() {
    if (!form.title || !form.location) return;
    setGeneratingDesc(true);
    try {
      const res = await fetch("/api/generate-property-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          price: form.price,
          location: form.location,
          city: form.city,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          area: form.area,
          amenities: form.amenities,
          property_type: form.property_type,
          furnishing: form.furnishing,
        }),
      });
      const data = await res.json();
      if (data.description) {
        setForm((prev) => ({ ...prev, description: data.description }));
      }
    } catch {
      // silently fail
    }
    setGeneratingDesc(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.price || !form.location || !form.city) {
      setError("Title, price, location, and city are required.");
      return;
    }

    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Property" : "Add New Property"}
      description="Fill in the property details below."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input label="Property Title" placeholder="3BHK Apartment — Anna Nagar, Chennai" value={form.title} onChange={set("title")} required />
            </div>
            <Input label="Price (₹)" type="number" placeholder="8500000" value={form.price || ""} onChange={setNum("price")} required />
            <Select label="Property Type" value={form.property_type} onChange={set("property_type")} options={typeOptions} placeholder="Select type" />
            <Input label="Location / Area" placeholder="Anna Nagar" value={form.location} onChange={set("location")} required />
            <Input label="City" placeholder="Chennai" value={form.city} onChange={set("city")} required />
          </div>
        </section>

        {/* Details */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Property Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Bedrooms" type="number" min={0} value={form.bedrooms || ""} onChange={setNum("bedrooms")} />
            <Input label="Bathrooms" type="number" min={0} value={form.bathrooms || ""} onChange={setNum("bathrooms")} />
            <Input label="Area (sq ft)" type="number" min={0} value={form.area || ""} onChange={setNum("area")} />
            <Select label="Furnishing" value={form.furnishing} onChange={set("furnishing")} options={furnishingOptions} placeholder="Select" />
          </div>
        </section>

        {/* Status */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Status
          </h3>
          <div className="flex gap-3 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status: s.value as PropertyStatus }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  form.status === s.value
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                    : "bg-[var(--surface-2)] border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Description */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              Description
            </h3>
            <button
              type="button"
              onClick={generateDescription}
              disabled={generatingDesc || !form.title || !form.location}
              title={!form.title || !form.location ? "Fill in title and location first" : "Generate with AI"}
              className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {generatingDesc
                ? <Loader2 size={11} className="animate-spin" />
                : <Sparkles size={11} />
              }
              {generatingDesc ? "Generating…" : "Generate with AI"}
            </button>
          </div>
          <textarea
            rows={4}
            placeholder="Describe the property — highlights, surroundings, nearby landmarks…"
            value={form.description}
            onChange={set("description")}
            className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-none"
          />
        </section>

        {/* Amenities */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Amenities
          </h3>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                  form.amenities.includes(a)
                    ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent-hover)]"
                    : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-strong)]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Photos */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Photos
          </h3>
          <ImageUpload
            value={form.images}
            onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
            maxFiles={6}
          />
        </section>

        {/* Virtual Tour */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            Virtual Tour
          </h3>
          <Input
            label="Tour URL (YouTube / Video link)"
            placeholder="https://youtube.com/watch?v=..."
            value={form.tour_url}
            onChange={set("tour_url")}
          />
          <p className="text-xs text-[var(--foreground-subtle)] mt-1.5">
            Paste a YouTube or video URL. It will be embedded on the property detail page.
          </p>
        </section>

        {/* Error */}
        {error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Footer */}
        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : initial ? "Save Changes" : "Add Property"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
