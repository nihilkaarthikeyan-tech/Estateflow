"use client";

import { motion } from "framer-motion";
import { Clock, FileX, PhoneOff } from "lucide-react";

const pains = [
  {
    icon: Clock,
    color: "#ef4444",
    colorMuted: "rgba(239,68,68,0.1)",
    colorBorder: "rgba(239,68,68,0.2)",
    title: "You respond in 3 hours. They signed elsewhere in 2.",
    body: "A buyer WhatsApped at 11pm asking about a 3BHK. Your agent saw it at 9am. The lead had already signed with the competitor who replied at 11:04pm — with an AI.",
    stat: "78% of leads go to the first agent who responds",
  },
  {
    icon: FileX,
    color: "#f59e0b",
    colorMuted: "rgba(245,158,11,0.1)",
    colorBorder: "rgba(245,158,11,0.2)",
    title: "Your team spends 3 hours/day just copying WhatsApp messages.",
    body: "Name, phone, budget, location — manually typed into Excel, then into your CRM, then into a follow-up message. Every single lead. That's 750+ hours a year per agent. Wasted.",
    stat: "750+ hours/year lost to manual data entry per agent",
  },
  {
    icon: PhoneOff,
    color: "#8b5cf6",
    colorMuted: "rgba(139,92,246,0.1)",
    colorBorder: "rgba(139,92,246,0.2)",
    title: "You follow up once. The deal closes on the 5th follow-up.",
    body: "Research shows 80% of real estate deals close after 5+ follow-ups. Most agents stop after the first. Your CRM has no system. Leads go cold. Revenue disappears.",
    stat: "80% of deals close after the 5th follow-up",
  },
];

export default function Pain() {
  return (
    <section className="landing-section px-4 sm:px-6 relative">
      {/* Dark bg tint for this section */}
      <div className="absolute inset-0 bg-[var(--surface)]/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cinematic-reveal text-center mb-14"
        >
          <p className="section-label mb-4">The real problem</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Your agency is silently losing{" "}
            <span style={{ color: "#ef4444" }}>₹10L+ every month</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
            Not because the leads are bad. Because the process is broken.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="pain-card gradient-border p-6 flex flex-col gap-4"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: p.colorMuted, border: `1px solid ${p.colorBorder}` }}
              >
                <p.icon size={20} style={{ color: p.color }} />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[var(--foreground)] leading-snug">{p.title}</h3>

              {/* Body */}
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)] flex-1">{p.body}</p>

              {/* Stat */}
              <div
                className="px-3 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: p.colorMuted, color: p.color, border: `1px solid ${p.colorBorder}` }}
              >
                📌 {p.stat}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bridge line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12 text-lg sm:text-xl font-semibold text-[var(--foreground-muted)]"
        >
          EstateFlow fixes all three.{" "}
          <span className="text-[var(--foreground)]">Automatically.</span>
        </motion.p>
      </div>
    </section>
  );
}
