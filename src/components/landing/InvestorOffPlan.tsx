"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Building, TrendingUp, Languages } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const INVEST_BG = "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1920&q=80";

const blocks = [
  {
    icon: BadgeCheck,
    title: "Golden Visa qualifier",
    body: "EstateFlow flags any buyer with an AED 2M+ budget as Golden Visa-eligible — so your agents lead with 10-year residency, not just the property.",
    stat: "AED 2M+",
    statLabel: "Auto-flagged for residency",
  },
  {
    icon: Building,
    title: "Off-plan & developer tracking",
    body: "Track launches from Emaar, DAMAC, Sobha and Nakheel against each lead — with payment-plan stages and handover dates kept in one view.",
    stat: "4+ devs",
    statLabel: "Off-plan inventory matched",
  },
  {
    icon: TrendingUp,
    title: "ROI & rental yield, attached",
    body: "Every matched listing carries its expected rental yield and ROI. Investors get the numbers that close them — instantly, not after a callback.",
    stat: "Yield %",
    statLabel: "On every investor match",
  },
  {
    icon: Languages,
    title: "Replies in their language",
    body: "International buyers get an instant answer in Arabic, English, Russian, Hindi or Chinese — so no high-value enquiry cools off waiting for a human.",
    stat: "5 langs",
    statLabel: "Arabic · EN · RU · HI · ZH",
  },
];

export default function InvestorOffPlan() {
  return (
    <section id="investors" className="section-rule landing-section px-6 sm:px-12 relative overflow-hidden">
      {/* Ambient skyline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={INVEST_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.06]"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(201,169,110,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (Built for UAE deals)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Win the deals that matter here —<br />
            <em className="font-normal" style={{ fontStyle: "italic" }}>investors &amp; off-plan</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm text-[var(--foreground-muted)] max-w-lg leading-relaxed"
          >
            UAE buyers don&apos;t just buy homes — they buy yield, residency and the next launch.
            EstateFlow is built around how money actually moves in this market.
          </motion.p>
        </div>

        {/* 2x2 blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 p-8 sm:p-10 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--gold-muted)] border border-[rgba(201,169,110,0.35)] flex items-center justify-center shrink-0">
                  <b.icon size={20} className="text-[var(--gold)]" />
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", lineHeight: 1 }}>
                    {b.stat}
                  </p>
                  <p className="text-[10px] text-[var(--foreground-subtle)] mt-1.5 uppercase tracking-[0.08em]">{b.statLabel}</p>
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--foreground)] leading-snug"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {b.title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
