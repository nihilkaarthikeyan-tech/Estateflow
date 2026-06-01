"use client";

import { motion } from "framer-motion";
import { MessageCircle, Globe, Phone, Building2, ArrowRight, LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const channels: { name: string; note: string; initials?: string; icon?: LucideIcon }[] = [
  { name: "Bayut", note: "Portal enquiries auto-imported & scored", initials: "BY" },
  { name: "Property Finder", note: "Every lead captured the second it lands", initials: "PF" },
  { name: "Dubizzle", note: "No enquiry left sitting in an inbox", initials: "DZ" },
  { name: "WhatsApp", note: "Replied to instantly in Arabic or English", icon: MessageCircle },
  { name: "Your Website", note: "Forms & live chat flow straight to CRM", icon: Globe },
  { name: "Calls & Walk-ins", note: "Voice AI logs and qualifies every call", icon: Phone },
];

export default function PortalIntegrations() {
  return (
    <section id="channels" className="section-rule landing-section px-6 sm:px-12 relative">
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
              (Lead Sources)
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
            >
              Every lead, from every portal —<br />
              <em className="font-normal" style={{ fontStyle: "italic" }}>in one inbox</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[var(--foreground-muted)] max-w-xs leading-relaxed sm:text-right"
          >
            Bayut, Property Finder, Dubizzle, WhatsApp and your website — captured,
            replied to, and scored before your agent even picks up the phone.
          </motion.p>
        </div>

        {/* Channel grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {channels.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
              className="bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 p-8 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl border border-[rgba(201,169,110,0.35)] bg-[var(--gold-muted)] flex items-center justify-center shrink-0 text-[11px] font-bold text-[var(--gold)]">
                {c.icon ? <c.icon size={18} className="text-[var(--gold)]" /> : c.initials}
              </div>
              <div>
                <p className="text-base font-semibold text-[var(--foreground)]">{c.name}</p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1 leading-relaxed">{c.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unified result strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-px bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.06)] px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <ArrowRight size={18} className="text-[var(--gold)] shrink-0" />
            <Building2 size={18} className="text-[var(--gold)] shrink-0" />
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            <span className="font-semibold text-[var(--foreground)]">One unified pipeline.</span>{" "}
            Every channel feeds the same CRM — deduplicated, AI-scored, and assigned to the right agent automatically.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
