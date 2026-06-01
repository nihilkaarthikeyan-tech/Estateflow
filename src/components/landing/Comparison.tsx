"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Check } from "lucide-react";

const COMPARISON_BG = "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1920&q=80";

const rows = [
  { label: "Portal leads (Bayut/PF)", before: "Checked manually, hours late", after: "Auto-captured & scored in seconds" },
  { label: "Lead response time",    before: "2–3 hours (if lucky)",        after: "Under 90 seconds, automated" },
  { label: "Buyer's language",      before: "English only, replies delayed", after: "Instant Arabic & English replies" },
  { label: "Data entry",            before: "Manual, full of errors",       after: "AI extracts everything instantly" },
  { label: "Follow-ups",            before: "Forgotten 60% of the time",    after: "Never missed — fully automated" },
  { label: "After-hours enquiries", before: "Missed completely",            after: "AI handles 24/7, qualifies live" },
  { label: "Property matching",     before: "Manual search, takes hours",   after: "AI-matched in under 2 seconds" },
  { label: "Lead scoring",          before: "Gut feeling only",             after: "AI score 0–100, with reasoning" },
  { label: "Agent workload",        before: "Drowning in WhatsApp",         after: "Focus only on hot, ready leads" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Comparison() {
  return (
    <section className="section-rule landing-section px-6 sm:px-12 relative">
      {/* Luxury property ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={COMPARISON_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.06]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="mb-14 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (The Difference)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Your competitors are still using{" "}
            <em className="font-normal line-through text-[var(--foreground-subtle)]" style={{ fontStyle: "italic" }}>
              Excel &amp; WhatsApp
            </em>
          </motion.h2>
        </div>

        {/* ── Mobile: stacked cards ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5, ease }}
              className="border border-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-[var(--surface-2)]">
                <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-[0.1em]">{row.label}</p>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3 border-r border-[rgba(255,255,255,0.07)] flex items-start gap-2">
                  <X size={12} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{row.before}</p>
                </div>
                <div className="px-4 py-3 flex items-start gap-2 bg-[rgba(22,163,74,0.04)]">
                  <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--foreground)] leading-relaxed font-medium">{row.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Desktop: 3-column table ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="hidden md:block border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-[var(--surface-2)]">
            <div className="px-6 py-4 border-b border-r border-[rgba(255,255,255,0.07)]">
              <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-widest">Situation</p>
            </div>
            <div className="px-6 py-4 border-b border-r border-[rgba(255,255,255,0.07)] flex items-center gap-2">
              <X size={13} className="text-red-400" />
              <p className="text-[11px] font-semibold text-red-400 uppercase tracking-widest">Without EstateFlow</p>
            </div>
            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center gap-2 bg-[rgba(22,163,74,0.05)]">
              <Check size={13} className="text-emerald-400" />
              <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">With EstateFlow</p>
            </div>
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="grid grid-cols-[1.2fr_1fr_1fr] hover:bg-white/[0.015] transition-colors"
            >
              <div className="px-6 py-4 border-b border-r border-[rgba(255,255,255,0.06)] flex items-center">
                <span className="text-sm font-medium text-[var(--foreground)]">{row.label}</span>
              </div>
              <div className="px-6 py-4 border-b border-r border-[rgba(255,255,255,0.06)] flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <X size={9} className="text-red-400" />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">{row.before}</span>
              </div>
              <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-start gap-2.5 bg-[rgba(22,163,74,0.03)]">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={9} className="text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{row.after}</span>
              </div>
            </motion.div>
          ))}

          <div className="grid grid-cols-[1.2fr_1fr_1fr]">
            <div className="px-6 py-4 border-r border-[rgba(255,255,255,0.07)] bg-[var(--surface-2)]" />
            <div className="px-6 py-4 border-r border-[rgba(255,255,255,0.07)] bg-[var(--surface-2)]">
              <span className="text-sm text-red-400 font-semibold">Deals slipping away daily</span>
            </div>
            <div className="px-6 py-4 bg-[rgba(22,163,74,0.06)]">
              <span className="text-sm text-emerald-400 font-semibold">More closed deals, less effort</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
