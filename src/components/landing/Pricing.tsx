"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeader from "./SectionHeader";

const ease = [0.22, 1, 0.36, 1] as const;

const included = [
  "AI lead capture from Bayut, Property Finder & WhatsApp",
  "Arabic + English auto-replies, 24/7",
  "AI lead scoring and intent analysis",
  "Full CRM pipeline — New to Closed",
  "Automated follow-up sequences",
  "RERA, DLD, Trakheesi & Ejari workflows",
  "Off-plan & payment plan tracking",
  "Golden Visa buyer flagging",
  "Voice AI agent for your website",
  "Analytics and performance dashboard",
  "Multi-agent team management",
  "Custom branding and domain",
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader
          label="Pricing"
          title="Custom-built for your agency"
          description="We don't sell subscriptions. We build your agency a complete AI-powered CRM — tailored to your workflows, your team, and your market."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="bg-[var(--background)] p-10 sm:p-14"
          >
            <p className="section-label mb-6">(What You Get)</p>
            <ul className="space-y-4">
              {included.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-start gap-3 text-sm text-[var(--foreground-muted)]"
                >
                  <Check size={14} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Pricing panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="bg-[var(--surface)] p-10 sm:p-14 flex flex-col justify-between"
          >
            <div>
              <p className="section-label mb-6">(Investment)</p>
              <p
                className="font-serif font-bold text-[var(--foreground)] leading-none mb-3"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                }}
              >
                Custom
              </p>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-sm mb-8">
                Pricing depends on your agency size, the number of agents, and which integrations
                you need. We scope everything during the free demo call — no surprises.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  { label: "One-time build fee", note: "we set everything up for you" },
                  { label: "Optional monthly support", note: "updates, new features, hosting" },
                  { label: "Fully white-labelled", note: "your brand, your domain" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-[var(--foreground)]">{item.label}</span>
                      <span className="text-sm text-[var(--foreground-muted)]"> — {item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center py-4 rounded-full bg-[var(--foreground)] text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold)] transition-colors duration-200"
            >
              Get a Free Quote
            </a>
          </motion.div>
        </div>

        <p className="text-center text-sm text-[var(--foreground-subtle)] mt-10">
          Free demo call included · No commitment until you&apos;re ready
        </p>
      </div>
    </section>
  );
}
