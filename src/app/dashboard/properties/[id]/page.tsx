"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bed, Bath, Maximize2, MapPin, Pencil, Home,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Video,
  Calculator, CalendarCheck, ChevronDown, ChevronUp,
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
  const [showEMI, setShowEMI] = useState(false);
  const [emiForm, setEmiForm] = useState({ downPct: 20, rate: 8.5, years: 20 });
  const [bookOpen, setBookOpen] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", email: "", date: "", time: "10:00" });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

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
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
                <MapPin size={14} className="text-[var(--accent)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Location</h3>
              </div>
              <iframe
                title="Property location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.location}, ${property.city ?? ""}, India`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </motion.div>
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
            <Button size="lg" variant="secondary" className="w-full" onClick={() => setBookOpen(true)}>
              <CalendarCheck size={15} /> Book Site Visit
            </Button>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setEditOpen(true)}>
              <Pencil size={13} /> Edit Property
            </Button>

            {/* EMI Calculator */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setShowEMI((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calculator size={14} className="text-[var(--accent)]" />
                  EMI Calculator
                </div>
                {showEMI ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showEMI && (() => {
                const loan = property.price * (1 - emiForm.downPct / 100);
                const r = emiForm.rate / 12 / 100;
                const n = emiForm.years * 12;
                const emi = r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
                const totalPay = emi * n;
                const totalInt = totalPay - loan;
                const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;
                return (
                  <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[var(--border)]">
                    <div className="pt-3 flex flex-col gap-3">
                      {[
                        { label: `Down Payment (${emiForm.downPct}%)`, key: "downPct" as const, min: 5, max: 90, step: 5, suffix: "%" },
                        { label: `Interest Rate (${emiForm.rate}%)`, key: "rate" as const, min: 5, max: 20, step: 0.5, suffix: "%" },
                        { label: `Tenure (${emiForm.years} yrs)`, key: "years" as const, min: 1, max: 30, step: 1, suffix: "yr" },
                      ].map(({ label, key, min, max, step }) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-[var(--foreground-muted)]">{label}</span>
                          </div>
                          <input
                            type="range" min={min} max={max} step={step}
                            value={emiForm[key]}
                            onChange={(e) => setEmiForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
                            className="w-full accent-[var(--accent)] h-1.5 rounded-full cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--foreground-muted)]">Loan Amount</span>
                        <span className="font-semibold text-[var(--foreground)]">{fmt(loan)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--foreground-muted)]">Monthly EMI</span>
                        <span className="font-bold text-[var(--accent)] text-base">{fmt(emi)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--foreground-muted)]">Total Interest</span>
                        <span className="font-semibold text-[var(--foreground)]">{fmt(totalInt)}</span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-[var(--border-accent)] pt-2">
                        <span className="text-[var(--foreground-muted)]">Total Payment</span>
                        <span className="font-semibold text-[var(--foreground)]">{fmt(totalPay)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Book Visit Modal */}
      {bookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            {bookSuccess ? (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-[var(--success)]" />
                </div>
                <p className="text-base font-bold text-[var(--foreground)]">Visit Scheduled!</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {bookForm.name} — {bookForm.date} at {bookForm.time}
                </p>
                <button onClick={() => { setBookOpen(false); setBookSuccess(false); setBookForm({ name: "", phone: "", email: "", date: "", time: "10:00" }); }}
                  className="mt-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-[var(--foreground)]">Book Site Visit</h2>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate max-w-[260px]">{property.title}</p>
                  </div>
                  <button onClick={() => setBookOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] transition-colors">
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Visitor Name *", key: "name", type: "text", placeholder: "Rahul Sharma" },
                    { label: "Phone *", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
                    { label: "Email", key: "email", type: "email", placeholder: "rahul@email.com" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">{label}</label>
                      <input type={type} placeholder={placeholder}
                        value={bookForm[key as keyof typeof bookForm]}
                        onChange={(e) => setBookForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Date *</label>
                      <input type="date" min={new Date().toISOString().split("T")[0]}
                        value={bookForm.date}
                        onChange={(e) => setBookForm((f) => ({ ...f, date: e.target.value }))}
                        className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Time *</label>
                      <select value={bookForm.time} onChange={(e) => setBookForm((f) => ({ ...f, time: e.target.value }))}
                        className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors">
                        {["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setBookOpen(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                      Cancel
                    </button>
                    <button
                      disabled={bookLoading || !bookForm.name || !bookForm.phone || !bookForm.date}
                      onClick={async () => {
                        setBookLoading(true);
                        const supabase = (await import("@/lib/supabase/client")).createClient();
                        const { data: { user } } = await supabase.auth.getUser();
                        const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user?.id ?? "").single();
                        await supabase.from("visits").insert({
                          organization_id: profile?.organization_id,
                          property_id: property.id,
                          visitor_name: bookForm.name,
                          visitor_phone: bookForm.phone,
                          visitor_email: bookForm.email || null,
                          visit_date: bookForm.date,
                          visit_time: bookForm.time,
                          status: "scheduled",
                        });
                        setBookLoading(false);
                        setBookSuccess(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
                    >
                      {bookLoading ? <Loader2 size={14} className="animate-spin" /> : <CalendarCheck size={14} />}
                      Confirm Visit
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

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
