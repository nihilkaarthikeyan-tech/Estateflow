"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CalendarCheck, CheckCircle2, Loader2, MapPin, Home } from "lucide-react";
import Link from "next/link";

interface Property { id: string; title: string; location: string; city: string | null; }

const timeSlots = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];

export default function BookVisitPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ visitor_name: "", visitor_phone: "", visitor_email: "", property_id: "", visit_date: "", visit_time: "10:00" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/public/properties")
      .then((r) => r.json())
      .then((d) => setProperties(d.properties ?? []));
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.visitor_name || !form.visitor_phone || !form.visit_date) {
      setError("Name, phone and date are required."); return;
    }
    setLoading(true); setError("");
    const res = await fetch("/api/public/book-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organization_id: process.env.NEXT_PUBLIC_ORG_ID }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=60"
        alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 to-[var(--background)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">Estate<span className="gradient-text">Flow</span></span>
          </Link>
          <Link href="/listings" className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
            View all listings →
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "0 8px 24px var(--accent-glow)" }}>
            <CalendarCheck size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Book a Site Visit</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Schedule a visit and our agent will confirm within 30 minutes.</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--foreground)]">Visit Scheduled!</p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  {form.visit_date} at {form.visit_time}
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  Our agent will call {form.visitor_phone} to confirm.
                </p>
              </div>
              <button onClick={() => { setSuccess(false); setForm({ visitor_name: "", visitor_phone: "", visitor_email: "", property_id: "", visit_date: "", visit_time: "10:00" }); }}
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors mt-2">
                Book another visit
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5">

              {/* Property select */}
              <div>
                <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">
                  <Home size={11} className="inline mr-1" />Property (optional)
                </label>
                <select value={form.property_id} onChange={set("property_id")}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors">
                  <option value="">— Select a property (or leave blank) —</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.city ?? p.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", key: "visitor_name" as const, type: "text", placeholder: "Rahul Sharma" },
                  { label: "Phone *", key: "visitor_phone" as const, type: "tel", placeholder: "+91 98765 43210" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]} onChange={set(key)} required
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Email (optional)</label>
                <input type="email" placeholder="rahul@email.com" value={form.visitor_email} onChange={set("visitor_email")}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Preferred Date *</label>
                  <input type="date" value={form.visit_date} onChange={set("visit_date")} required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Preferred Time *</label>
                  <select value={form.visit_time} onChange={set("visit_time")}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors">
                    {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                {loading ? "Booking…" : "Book Site Visit"}
              </button>

              <p className="text-[11px] text-[var(--foreground-subtle)] text-center">
                Our agent will call you within 30 minutes to confirm your visit.
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Property highlights */}
        {properties.length > 0 && !success && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Available Properties</p>
            <div className="flex flex-col gap-2">
              {properties.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                  <MapPin size={13} className="text-[var(--accent)] shrink-0" />
                  <p className="text-sm text-[var(--foreground)] truncate">{p.title}</p>
                  <span className="text-xs text-[var(--foreground-muted)] ml-auto shrink-0">{p.city ?? p.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
