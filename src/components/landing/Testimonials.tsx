"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const TESTIMONIALS_BG = "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1920&q=80";

const outcomes = [
  {
    metric: "3 hrs → 90s",
    headline: "Response time that wins deals",
    body: "Most Indian agencies respond to leads in 3–6 hours. The buyer has already talked to two competitors by then. EstateFlow's AI replies instantly — extracts requirements and scores intent before your agent even opens their phone.",
    tag: "Lead Response",
    initials: "LR",
  },
  {
    metric: "0 leads lost",
    headline: "Every midnight enquiry, captured",
    body: "Real estate buyers browse at 11 PM. Your current process misses every one of them. EstateFlow's voice agent and AI intake work round the clock — so Monday morning your CRM already has the weekend's qualified leads waiting.",
    tag: "24/7 Coverage",
    initials: "AC",
  },
  {
    metric: "1 place",
    headline: "Your full pipeline, visible at a glance",
    body: "Leads across WhatsApp, calls, and web forms land in one CRM. Every lead is staged from New to Closed, AI-analyzed with budget and urgency, and assigned to the right agent — no spreadsheets, no sticky notes.",
    tag: "CRM Pipeline",
    initials: "CP",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-rule landing-section px-6 sm:px-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={TESTIMONIALS_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.09]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">

        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (Real Results)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            What EstateFlow<br />
            <em className="font-normal" style={{ fontStyle: "italic" }}>actually changes for your agency</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm text-[var(--foreground-muted)] max-w-md"
          >
            We&apos;re in early access. Here&apos;s exactly what your team gains from day one.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.tag}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 p-8 sm:p-10 flex flex-col gap-6"
            >
              {/* Big metric */}
              <p
                className="font-serif font-bold text-[var(--gold)]"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1,
                }}
              >
                {o.metric}
              </p>

              <div>
                <h3
                  className="font-serif text-lg font-bold text-[var(--foreground)] mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {o.headline}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  {o.body}
                </p>
              </div>

              <div className="pt-5 border-t border-[rgba(255,255,255,0.07)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[rgba(201,169,110,0.4)] flex items-center justify-center text-[10px] font-bold text-[var(--gold)] shrink-0">
                  {o.initials}
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-[0.1em]">
                  {o.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip instead of fake stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-px bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.06)] px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Be among the first agencies in India to use EstateFlow
            </p>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Currently onboarding select agencies. Early access is free.
            </p>
          </div>
          <a href="/signup" className="btn-oval shrink-0">
            Request early access
          </a>
        </motion.div>
      </div>
    </section>
  );
}
