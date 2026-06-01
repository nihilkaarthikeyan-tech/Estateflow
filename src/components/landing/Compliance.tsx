"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const badges = [
  { code: "RERA", label: "Broker-registered workflow" },
  { code: "DLD", label: "Dubai Land Department ready" },
  { code: "Trakheesi", label: "Permit number on every listing" },
  { code: "Ejari", label: "Tenancy contract tracking" },
  { code: "Oqood", label: "Off-plan registration aware" },
];

export default function Compliance() {
  return (
    <section id="compliance" className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

          {/* Left — headline */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label mb-5"
            >
              (Compliance)
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
            >
              Built around the<br />
              <em className="font-normal" style={{ fontStyle: "italic" }}>UAE rulebook</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-sm text-[var(--foreground-muted)] max-w-md leading-relaxed"
            >
              Your BRN and agency details stay attached to every deal. Listings keep their
              Trakheesi permit, tenancies map to Ejari, and off-plan maps to Oqood — so your
              pipeline is audit-ready, not a compliance headache.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-7 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--gold-muted)] border border-[rgba(201,169,110,0.35)]"
            >
              <ShieldCheck size={16} className="text-[var(--gold)]" />
              <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-[0.1em]">
                Designed for DLD & RERA workflows
              </span>
            </motion.div>
          </div>

          {/* Right — badge stack */}
          <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
            {badges.map((b, i) => (
              <motion.div
                key={b.code}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease }}
                className="bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 px-7 py-6 flex items-center gap-5"
              >
                <span className="font-serif text-xl font-bold text-[var(--gold)] min-w-[120px]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {b.code}
                </span>
                <span className="text-sm text-[var(--foreground-muted)]">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
