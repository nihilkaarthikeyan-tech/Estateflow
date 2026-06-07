"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

// Conservative model: research shows ~80% of deals close after 5+ follow-ups,
// yet most agents stop at one — so a large share of leads is lost to slow/no
// follow-up. EstateFlow's instant capture + automated sequences recover a
// meaningful portion. We express the gain as a relative uplift on conversion.
const FOLLOWUP_UPLIFT = 0.4; // +40% relative conversion (kept deliberately modest)

function aed(n: number) {
  return "AED " + Math.round(n).toLocaleString("en-AE");
}

export default function RoiCalculator() {
  const [leads, setLeads] = useState(100);
  const [commission, setCommission] = useState(30000);
  const [conversion, setConversion] = useState(2);

  const { extraDealsYear, extraRevenueMonth, extraRevenueYear } = useMemo(() => {
    const conv = conversion / 100;
    const extraDealsMonth = leads * conv * FOLLOWUP_UPLIFT;
    const extraRevenueMonth = extraDealsMonth * commission;
    return {
      extraDealsYear: extraDealsMonth * 12,
      extraRevenueMonth,
      extraRevenueYear: extraRevenueMonth * 12,
    };
  }, [leads, commission, conversion]);

  const fields = [
    { label: "Leads per month", value: leads, set: setLeads, min: 10, max: 500, step: 10, fmt: (v: number) => `${v}` },
    { label: "Avg. commission per deal", value: commission, set: setCommission, min: 5000, max: 200000, step: 5000, fmt: aed },
    { label: "Current conversion rate", value: conversion, set: setConversion, min: 1, max: 15, step: 1, fmt: (v: number) => `${v}%` },
  ];

  return (
    <section id="roi" className="section-rule landing-section px-6 sm:px-12 relative">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label mb-5"
            >
              (The Cost of Slow Follow-up)
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
            >
              See what you&apos;re leaving<br />
              <em className="font-normal" style={{ fontStyle: "italic" }}>on the table</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[var(--foreground-muted)] max-w-xs leading-relaxed sm:text-right"
          >
            Drag the sliders to match your agency. This is the extra revenue EstateFlow
            recovers just by never letting a lead go cold.
          </motion.p>
        </div>

        {/* Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="bg-[var(--background)] p-8 sm:p-12 flex flex-col gap-10 justify-center"
          >
            {fields.map((f) => (
              <div key={f.label}>
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-sm font-medium text-[var(--foreground-muted)]">{f.label}</label>
                  <span className="font-serif text-xl font-bold text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                    {f.fmt(f.value)}
                  </span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="roi-slider w-full"
                />
              </div>
            ))}
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="forest-panel p-8 sm:p-12 flex flex-col justify-center gap-8"
          >
            <div>
              <p className="section-label text-[var(--foreground-subtle)] mb-3">Extra revenue / year</p>
              <p className="font-serif font-bold text-[var(--gold)] leading-none tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>
                {aed(extraRevenueYear)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.08)]">
              <div className="bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-2xl font-bold text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  +{extraDealsYear.toFixed(1)}
                </p>
                <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em] mt-1">Extra deals / year</p>
              </div>
              <div className="bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-2xl font-bold text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {aed(extraRevenueMonth)}
                </p>
                <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em] mt-1">Extra / month</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[var(--foreground-muted)] leading-relaxed">
              <TrendingUp size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
              <span>
                Based on a conservative 40% lift in follow-up conversion — the leads you already
                pay for, simply worked properly.
              </span>
            </div>

            <a href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[var(--foreground)] text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold)] transition-colors duration-200">
              Capture this revenue <ArrowRight size={13} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
