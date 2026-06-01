"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is EstateFlow AI?",
    a: "EstateFlow is an AI-first real estate CRM built for UAE agencies, brokers and developers. It captures leads from Bayut, Property Finder, Dubizzle and WhatsApp, qualifies them, matches properties and automates follow-ups — all from one RERA-ready dashboard.",
  },
  {
    q: "Which lead sources does it connect to?",
    a: "Bayut, Property Finder, Dubizzle, your own website, WhatsApp and direct calls all flow into one inbox. Every enquiry is auto-captured, deduplicated, scored 0–100 and assigned to the right agent — nothing sits unanswered.",
  },
  {
    q: "Does the AI reply in Arabic?",
    a: "Yes. The AI reads and replies in Arabic and English — plus Russian, Hindi and Chinese — so your international buyers get an instant answer in their own language, day or night.",
  },
  {
    q: "Is EstateFlow RERA and DLD ready?",
    a: "It's built around UAE workflows. Listings keep their Trakheesi permit number, your BRN and agency details stay attached to every deal, tenancies map to Ejari and off-plan to Oqood — so your pipeline stays audit-ready with the DLD.",
  },
  {
    q: "Can it handle off-plan and payment plans?",
    a: "Yes. Track off-plan launches from developers like Emaar, DAMAC, Sobha and Nakheel against each lead, with payment-plan stages and handover dates kept in one view.",
  },
  {
    q: "Can it flag Golden Visa-eligible buyers?",
    a: "Yes. Buyers with an AED 2M+ budget are automatically flagged as Golden Visa-eligible, so your agents can lead with 10-year residency — not just the property.",
  },
  {
    q: "How does AI lead analysis work?",
    a: "Portal, WhatsApp and web leads are parsed by AI to extract budget (in AED), area, property type, urgency and intent. The platform scores each lead 0–100 and suggests the best next step for your agent.",
  },
  {
    q: "Can multiple agents and branches use it?",
    a: "Yes. You can add your full team, define roles (admin/agent), assign leads to specific agents and manage performance across offices with centralized reporting.",
  },
  {
    q: "Is my agency data secure?",
    a: "Yes. EstateFlow uses row-level security so each agency's data is completely isolated. All data is encrypted in transit and at rest. We never share your data with any third party.",
  },
  {
    q: "What is the Voice AI agent?",
    a: "The Voice AI agent is a real-time phone assistant on your website and office line. Buyers talk to an AI that answers questions, qualifies them and captures their requirements in Arabic or English — 24/7.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. Every plan includes a 14-day free trial with full access to all features. No credit card required to start.",
  },
  {
    q: "How long does setup take?",
    a: "Under 10 minutes. Sign up, add your agency details, and your AI chatbot and lead capture form are live immediately. No technical setup needed.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border-b border-[var(--border)]"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className={`text-sm font-semibold transition-colors leading-relaxed ${open ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"}`}>
          {q}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${open ? "bg-[var(--gold-muted)] border-[var(--gold-border)] text-[var(--gold)]" : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground-subtle)]"}`}>
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-[var(--foreground-muted)]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const half = Math.ceil(faqs.length / 2);

  return (
    <section id="faq" className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (FAQ)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Everything you need<br />
            <em className="font-normal" style={{ fontStyle: "italic" }}>to know</em>
          </motion.h2>
          <p className="mt-5 text-sm text-[var(--foreground-muted)]">
            Still have questions?{" "}
            <a href="mailto:nihilkaarthikeyan@gmail.com" className="text-[var(--gold)] hover:underline">
              Email us →
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
          <div className="border-t border-[var(--border)]">
            {faqs.slice(0, half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i} />
            ))}
          </div>
          <div className="border-t border-[var(--border)]">
            {faqs.slice(half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i + half} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
