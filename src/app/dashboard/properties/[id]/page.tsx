"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bed, Bath, Maximize2, MapPin, Pencil, Home,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Video,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Property, PropertyStatus } from "@/types";

const statusBadge: Record<PropertyStatus, "success" | "warning" | "default" | "danger"> = {
  available: "success",
  reserved: "warning",
  upcoming: "accent" as never,
  sold: "default",
};

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(data as Property);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleUpdate(payload: Omit<Property, "id" | "created_at" | "organization_id">) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error) setProperty(data as Property);
    return { error: error?.message };
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    setDeleteLoading(false);
    router.push("/dashboard/properties");
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Property Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Property Not Found" />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-[var(--foreground-muted)]">This property doesn&apos;t exist or was deleted.</p>
          <Link href="/dashboard/properties">
            <Button variant="secondary" size="sm"><ArrowLeft size={14} /> Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images ?? [];

  return (
    <div className="flex flex-col flex-1">
      <TopBar title={property.title} subtitle={`${property.city ?? property.location}`} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/properties">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={14} /> Properties
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil size={13} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — images + description */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Image carousel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] aspect-video"
            >
              {images.length > 0 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[imgIdx]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIdx(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white w-4" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
                    alt="Property placeholder"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10">
                      <Home size={28} className="text-white/50" />
                    </div>
                    <p className="text-sm font-medium text-white/50">No images uploaded</p>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      Add photos →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imgIdx ? "border-[var(--accent)]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {property.description && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Description</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </motion.div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 rounded-full"
                    >
                      <CheckCircle2 size={11} className="text-[var(--success)]" />
                      {a}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Virtual Tour */}
            {property.tour_url && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Video size={14} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Virtual Tour</h3>
                </div>
                {(() => {
                  const url = property.tour_url!;
                  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                  if (ytMatch) {
                    return (
                      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: "56.25%" }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0 rounded-lg"
                        />
                      </div>
                    );
                  }
                  return (
                    <video
                      src={url}
                      controls
                      className="w-full rounded-lg bg-[var(--surface-2)]"
                    />
                  );
                })()}
              </motion.div>
            )}
          </div>

          {/* Right — details panel */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={statusBadge[property.status]}>{property.status}</Badge>
                {property.property_type && (
                  <span className="text-xs text-[var(--foreground-muted)] capitalize">
                    {property.property_type.replace("_", " ")}
                  </span>
                )}
              </div>

              <h1 className="text-base font-bold text-[var(--foreground)] mb-1 leading-snug">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-4">
                <MapPin size={12} />
                {property.location}{property.city ? `, ${property.city}` : ""}
              </div>

              <p className="text-3xl font-bold text-[var(--accent)] mb-5">
                {formatPrice(property.price)}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: Bed, label: "Beds", value: property.bedrooms || "—" },
                  { icon: Bath, label: "Baths", value: property.bathrooms || "—" },
                  { icon: Maximize2, label: "sq ft", value: property.area > 0 ? property.area.toLocaleString() : "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[var(--surface-2)] rounded-lg p-3 text-center">
                    <Icon size={14} className="text-[var(--accent)] mx-auto mb-1" />
                    <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
                  </div>
                ))}
              </div>

              {property.furnishing && (
                <div className="text-xs text-[var(--foreground-muted)] bg-[var(--surface-2)] rounded-lg px-3 py-2 capitalize">
                  {property.furnishing.replace("_", " ")}
                </div>
              )}
            </div>

            <Button size="lg" className="w-full">
              Match to Lead
            </Button>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setEditOpen(true)}>
              <Pencil size={13} /> Edit Property
            </Button>
          </motion.div>
        </div>
      </div>

      <PropertyFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initial={property}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Property"
        message={`Are you sure you want to delete "${property.title}"? This cannot be undone.`}
        confirmLabel="Delete Property"
      />
    </div>
  );
}
