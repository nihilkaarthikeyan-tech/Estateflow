"use client";

import { motion } from "framer-motion";
import { ArrowDown, X, Check } from "lucide-react";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

const reasons = [
  "Instant reply to every lead",
  "AI filters serious buyers first",
  "Automated 5-step follow-up",
  "Best-fit property pre-matched",
];

const funnelBefore = [
  { label: "Leads received",  value: 100, pct: "100%" },
  { label: "Leads responded to in time", value: 40,  pct: "40%"  },
  { label: "Site visits booked",          value: 10,  pct: "10%"  },
  { label: "Deals closed",                value: 2,   pct: "2%"   },
];

const funnelAfter = [
  { label: "Leads received",  value: 100, pct: "100%" },
  { label: "Leads responded to in time", value: 100, pct: "100%" },
  { label: "Site visits booked",          value: 30,  pct: "30%"  },
  { label: "Deals closed",                value: 6,   pct: "6%"   },
];

export default function RevenueOutcome() {
  return (
    <section id="revenue" className="section-rule landing-section px-6 sm:px-12 relative">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (The Revenue Difference)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Same leads. Same team.<br />
            <em className="font-normal" style={{ fontStyle: "italic", color: "var(--gold)" }}>3× more deals.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm text-[var(--foreground-muted)] max-w-lg leading-relaxed"
          >
            UAE agency owners don&apos;t buy software — they buy outcomes. Here&apos;s exactly what
            changes when your agency runs on EstateFlow.
          </motion.p>
        </div>

        {/* Main comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start">

          {/* Before funnel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center gap-2.5 mb-6 px-4 py-2.5 rounded-full bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] w-fit">
              <X size={14} className="text-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-[0.1em]">Without EstateFlow</span>
            </div>
            <div className="flex flex-col gap-0">
              {funnelBefore.map((row, i) => (
                <div key={row.label} className="relative">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[var(--surface)] border border-[rgba(239,68,68,0.12)] rounded-xl mb-1">
                    <span className="text-sm text-[var(--foreground-muted)]">{row.label}</span>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold text-red-400">{row.value}</span>
                      <span className="text-xs text-red-400/60 ml-1">{row.pct}</span>
                    </div>
                  </div>
                  {i < funnelBefore.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={14} className="text-red-400/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)]">
              <p className="text-xs font-bold text-red-400 mb-1">Revenue per 100 leads</p>
              <p className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                AED 120K
              </p>
              <p className="text-xs text-[var(--foreground-subtle)] mt-1">2 deals × AED 60K avg commission</p>
            </div>
          </motion.div>

          {/* Divider + reasons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-5 py-8"
          >
            <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />
            <div className="px-5 py-4 rounded-2xl border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.06)] max-w-[200px]">
              <p className="text-[10px] text-[var(--gold)] uppercase tracking-[0.12em] font-semibold mb-3 text-center">Why it works</p>
              <div className="flex flex-col gap-2">
                {reasons.map(r => (
                  <div key={r} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[rgba(201,169,110,0.2)] border border-[rgba(201,169,110,0.4)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={9} className="text-[var(--gold)]" />
                    </div>
                    <span className="text-[11px] text-[var(--foreground-muted)] leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />
          </motion.div>

          {/* After funnel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center gap-2.5 mb-6 px-4 py-2.5 rounded-full bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.2)] w-fit">
              <Check size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.1em]">With EstateFlow</span>
            </div>
            <div className="flex flex-col gap-0">
              {funnelAfter.map((row, i) => (
                <div key={row.label} className="relative">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[rgba(22,163,74,0.04)] border border-[rgba(22,163,74,0.15)] rounded-xl mb-1">
                    <span className="text-sm text-[var(--foreground)]">{row.label}</span>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold text-emerald-400">{row.value}</span>
                      <span className="text-xs text-emerald-400/60 ml-1">{row.pct}</span>
                    </div>
                  </div>
                  {i < funnelAfter.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={14} className="text-emerald-400/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-4 rounded-xl border border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.05)]">
              <p className="text-xs font-bold text-emerald-400 mb-1">Revenue per 100 leads</p>
              <p className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                AED 360K
              </p>
              <p className="text-xs text-[var(--foreground-subtle)] mt-1">6 deals × AED 60K avg commission</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-[rgba(255,255,255,0.07)]"
        >
          <div>
            <p className="text-lg font-bold text-[var(--foreground)]">
              AED 240K more revenue. Same 100 leads.
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              The only difference is how fast you respond and how well you follow up.
            </p>
          </div>
          <Link href="/signup"
            className="shrink-0 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[var(--gold)] text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold-light)] transition-colors duration-200">
            See This In Your Agency
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
