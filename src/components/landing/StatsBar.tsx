"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const STATS_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80";

const stats = [
  {
    value: "< 2s",
    label: "Lead scored by AI",
    sub: "from first message",
    context: "Industry avg: 3–6 hours",
  },
  {
    value: "24/7",
    label: "Zero missed enquiries",
    sub: "nights, weekends, holidays",
    context: "While your team sleeps",
  },
  {
    value: "6",
    label: "Pipeline stages tracked",
    sub: "new → closed, in one view",
    context: "No spreadsheets needed",
  },
  {
    value: "5×",
    label: "Follow-up touchpoints",
    sub: "automated per lead",
    context: "80% of deals close after 5+",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function StatsBar() {
  return (
    <section className="stats-section section-rule relative overflow-hidden">

      <div className="absolute inset-0">
        <Image
          src={STATS_IMG}
          alt="Luxury real estate"
          fill
          className="stats-bg-img object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[rgba(13,15,14,0.90)]" />
      </div>

      <div className="relative z-10 px-6 sm:px-12 py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-label mb-16 sm:mb-24 text-white/40"
          >
            (What changes on day one)
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
                className={`stat-number-item ${i % 2 === 1 ? "md:mt-16 mt-0" : ""}`}
              >
                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "clamp(3rem, 7vw, 6rem)",
                    fontWeight: 700,
                    lineHeight: 0.9,
                    color: "white",
                  }}
                >
                  {s.value}
                </p>
                <p className="mt-4 text-sm text-white/80 font-medium leading-snug">{s.label}</p>
                <p className="mt-1 text-xs text-white/40">{s.sub}</p>
                <p className="mt-3 text-[10px] text-white/25 uppercase tracking-[0.1em]">{s.context}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 sm:mt-28 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <p className="font-serif italic text-xl sm:text-2xl text-white/50 max-w-lg leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              &ldquo;The AI that works while you sleep — and closes while you talk.&rdquo;
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/40 uppercase tracking-[0.14em]">Built for Indian real estate teams</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
