"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    num: "01",
    title: "WhatsApp",
    titleItalic: "Lead Capture",
    body: "Every buyer who messages on WhatsApp is automatically captured, replied to within 4 seconds, and logged in your CRM — even at midnight. You wake up to warm, qualified leads.",
    stat: "< 4s",
    statLabel: "First reply time",
  },
  {
    num: "02",
    title: "AI Lead",
    titleItalic: "Scoring",
    body: "EstateFlow reads every enquiry and scores buyer intent from 1–100. Budget, urgency, location, property type — extracted instantly. Your agent knows exactly who to call first.",
    stat: "94",
    statLabel: "Avg. score accuracy",
  },
  {
    num: "03",
    title: "Automated",
    titleItalic: "Follow-Ups",
    body: "80% of deals close after 5+ follow-ups. EstateFlow sends all 5 — via WhatsApp — at the perfect intervals. Your lead never goes cold again while you're in a site visit.",
    stat: "5×",
    statLabel: "Follow-up touchpoints",
  },
  {
    num: "04",
    title: "Smart Property",
    titleItalic: "Matching",
    body: "AI instantly matches every buyer to your best listings based on their stated and inferred preferences. Your agent walks into every meeting already knowing which 3 properties to show.",
    stat: "98%",
    statLabel: "Match accuracy",
  },
  {
    num: "05",
    title: "Voice AI",
    titleItalic: "Agent",
    body: "A 24/7 AI voice agent answers every call to your office number, qualifies the buyer, extracts requirements, and books site visits — while you're in a meeting or asleep.",
    stat: "24/7",
    statLabel: "Always on",
  },
  {
    num: "06",
    title: "Revenue",
    titleItalic: "Analytics",
    body: "See your full pipeline at a glance — leads by stage, agent performance, conversion rates, deal size. Know exactly where your next ₹1Cr is coming from before end of month.",
    stat: "₹2.4Cr",
    statLabel: "Avg. monthly pipeline",
  },
];

export default function Features() {
  return (
    <section id="features" className="section-rule landing-section px-6 sm:px-12">
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
              (What EstateFlow Does)
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
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

        {/* Numbered feature grid — like Elyse beliefs cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease }}
              className="bg-[var(--background)] p-8 sm:p-10 flex flex-col gap-6 group hover:bg-[var(--surface)] transition-colors duration-300"
            >
              {/* Number — italic like Elyse */}
              <span className="font-serif italic text-5xl font-400 text-[rgba(255,255,255,0.12)] group-hover:text-[rgba(201,169,110,0.3)] transition-colors"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
                ({f.num})
              </span>

              {/* Title — mixed roman + italic */}
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--foreground)] leading-tight"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {f.title}{" "}
                  <em className="font-normal" style={{ fontStyle: "italic" }}>{f.titleItalic}</em>
                </h3>
              </div>

              {/* Body */}
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed flex-1">
                {f.body}
              </p>

              {/* Stat */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
                <p className="font-serif text-2xl font-bold text-[var(--gold)]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {f.stat}
                </p>
                <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em] mt-1">{f.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
