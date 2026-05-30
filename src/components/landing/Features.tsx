"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES_BG = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80";

const features = [
  {
    num: "01",
    title: "WhatsApp",
    titleItalic: "Lead Capture",
    body: "Every buyer who messages on WhatsApp is automatically captured, replied to instantly, and logged in your CRM — even at midnight. You wake up to warm, qualified leads ready to call.",
    stat: "< 2s",
    statLabel: "AI reply time",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    title: "AI Lead",
    titleItalic: "Scoring",
    body: "EstateFlow reads every enquiry and extracts budget, urgency, location and property type automatically. Your agent sees a full lead profile the moment the message arrives — no manual data entry.",
    stat: "1–100",
    statLabel: "Intent score range",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    title: "Automated",
    titleItalic: "Follow-Ups",
    body: "Research shows 80% of deals close after 5+ follow-ups — yet most agents stop at one. EstateFlow sends timed follow-ups via WhatsApp automatically so no lead goes cold while you're at a site visit.",
    stat: "5×",
    statLabel: "Follow-up touchpoints",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    title: "Smart Property",
    titleItalic: "Matching",
    body: "AI instantly maps each buyer's stated requirements to your live listings. Your agent walks into every meeting already knowing the top 3 properties to show — no browsing, no guessing.",
    stat: "Top 3",
    statLabel: "Listings surfaced per lead",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    title: "Voice AI",
    titleItalic: "Agent",
    body: "A 24/7 AI voice agent answers every call to your office number, qualifies the buyer, extracts requirements, and books site visits — while you're in a meeting or asleep.",
    stat: "24/7",
    statLabel: "Always answering",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    title: "Pipeline",
    titleItalic: "Analytics",
    body: "See every lead by stage across your full funnel — new, contacted, qualified, site visit, negotiation, closed. Know exactly where deals are stalling and which agents need support.",
    stat: "6",
    statLabel: "Pipeline stages tracked",
    img: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Features() {
  return (
    <section id="features" className="section-rule landing-section px-6 sm:px-12 relative">
      {/* Ambient property image in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={FEATURES_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.08]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label mb-5"
            >
              (What EstateFlow Does)
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="cinematic-reveal font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
            >
              Every tool an agent needs<br />
              <em className="font-normal" style={{ fontStyle: "italic" }}>to win more deals</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[var(--foreground-muted)] max-w-xs leading-relaxed sm:text-right"
          >
            Not just a CRM — a full AI engine built for how Indian real estate teams actually work.
          </motion.p>
        </div>

        {/* Feature grid — image header cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease }}
              className="feature-card-item bg-[var(--background)] flex flex-col group hover:bg-[var(--surface)] transition-colors duration-300 overflow-hidden"
            >
              {/* Property image header */}
              <div className="relative h-40 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.img}
                  alt=""
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient fade to card background */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[var(--background)]" />
                {/* Number overlaid on image */}
                <span
                  className="absolute bottom-3 left-8 font-serif italic text-5xl text-white/25 group-hover:text-[rgba(201,169,110,0.45)] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
                >
                  ({f.num})
                </span>
              </div>

              {/* Content */}
              <div className="px-8 sm:px-10 pb-8 sm:pb-10 pt-4 flex flex-col gap-5 flex-1">
                <h3
                  className="font-serif text-xl font-bold text-[var(--foreground)] leading-tight"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {f.title}{" "}
                  <em className="font-normal" style={{ fontStyle: "italic" }}>{f.titleItalic}</em>
                </h3>

                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed flex-1">
                  {f.body}
                </p>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
                  <p
                    className="font-serif text-3xl font-bold text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {f.stat}
                  </p>
                  <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em] mt-1">{f.statLabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
