"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

// Free Unsplash images
const INTERIOR_IMG = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";

const pains = [
  {
    num: "01",
    title: "You respond in 3 hours.",
    titleItalic: "They signed elsewhere in 2.",
    body: "A buyer WhatsApped at 11pm asking about a 3BHK. Your agent saw it at 9am. The lead had already signed with the competitor who replied at 11:04pm — with an AI.",
    stat: "78%",
    statLabel: "of leads go to the first agent who responds",
  },
  {
    num: "02",
    title: "3 hours a day",
    titleItalic: "copying WhatsApp into Excel.",
    body: "Name, phone, budget, location — manually typed into Excel, then into your CRM, then into a follow-up message. Every single lead. That's 750+ hours a year per agent. Wasted.",
    stat: "750+",
    statLabel: "hours per year lost to manual data entry",
  },
  {
    num: "03",
    title: "You follow up once.",
    titleItalic: "The deal closes on the 5th.",
    body: "Research shows 80% of real estate deals close after 5+ follow-ups. Most agents stop after the first. Your CRM has no system. Leads go cold. Revenue disappears.",
    stat: "80%",
    statLabel: "of deals close after 5+ follow-ups",
  },
];

export default function Pain() {
  return (
    <section className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (The Real Problem)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Your agency is silently<br />
            <em className="font-normal" style={{ fontStyle: "italic", color: "#f87171" }}>losing ₹10L+ every month</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm text-[var(--foreground-muted)] max-w-md leading-relaxed"
          >
            Not because the leads are bad. Because the process is broken.
          </motion.p>
        </div>

        {/* 2-column layout: image left, cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">

          {/* Property image — tall, editorial */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative min-h-[400px] lg:min-h-[600px] overflow-hidden"
          >
            <Image
              src={INTERIOR_IMG}
              alt="Luxury interior"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[rgba(13,15,14,0.4)]" />
            {/* Corner label */}
            <div className="absolute bottom-6 left-6">
              <p className="section-label text-white/60">(The Status Quo)</p>
              <p className="font-serif italic text-white/80 text-lg mt-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Beautiful property.<br />Lost because of process.
              </p>
            </div>
          </motion.div>

          {/* Pain cards stacked */}
          <div className="flex flex-col">
            {pains.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease }}
                className={`bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 p-8 sm:p-10 flex flex-col gap-4
                  ${i < 2 ? "border-b border-[rgba(255,255,255,0.06)]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-serif italic text-4xl text-[rgba(255,255,255,0.08)]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}>
                    ({p.num})
                  </span>
                  <div className="text-right">
                    <p className="font-serif text-3xl font-bold text-[#f87171]"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                      {p.stat}
                    </p>
                    <p className="text-[10px] text-[var(--foreground-subtle)] mt-0.5 max-w-[140px] text-right leading-snug">{p.statLabel}</p>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-[var(--foreground)] leading-snug"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {p.title}{" "}
                  <em className="font-normal text-[var(--foreground-muted)]" style={{ fontStyle: "italic" }}>
                    {p.titleItalic}
                  </em>
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bridge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 font-serif text-lg sm:text-xl italic text-[var(--foreground-muted)] text-center"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          EstateFlow fixes all three —{" "}
          <span className="text-[var(--foreground)] not-italic font-bold">automatically.</span>
        </motion.p>
      </div>
    </section>
  );
}
