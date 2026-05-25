"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is EstateFlow AI?",
    a: "EstateFlow is an AI-first real estate CRM for agencies, developers and brokerages. It automates lead capture, qualification, property matching and follow-ups from one dashboard.",
  },
  {
    q: "How does AI lead analysis work?",
    a: "WhatsApp and web leads are parsed by AI to extract budget, location, property type, urgency and intent. The platform then scores each lead 0–100 and suggests the best next step for your agent.",
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
    q: "Does EstateFlow support WhatsApp leads?",
    a: "Yes. WhatsApp enquiries can be forwarded or integrated — they are processed exactly like web form leads, with full AI analysis and CRM sync.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. Every plan includes a 14-day free trial with full access to all features. No credit card required to start.",
  },
  {
    q: "What is the Voice AI agent?",
    a: "The Voice AI agent is a real-time phone assistant on your website. Visitors click a button and talk to an AI that answers questions, qualifies them and captures their requirements — 24/7.",
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
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${open ? "bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent-light)]" : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground-subtle)]"}`}>
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
    <section id="faq" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Everything you need to know
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
            Still have questions? Email us at{" "}
            <a href="mailto:nihilkaarthikeyan@gmail.com" className="text-[var(--accent)] hover:underline">
              nihilkaarthikeyan@gmail.com
            </a>
          </p>
        </motion.div>

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
