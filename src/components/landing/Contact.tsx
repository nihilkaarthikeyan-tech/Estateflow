"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Zap } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative px-4 sm:px-6 py-28 sm:py-36 overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/50 to-[var(--surface)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(91,110,245,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--success-muted)] border border-[rgba(16,185,129,0.25)] text-[var(--success)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            Set up in under 10 minutes — no card required
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--foreground)] mb-6">
            Your next big deal is{" "}
            <span className="gradient-text-animated">already waiting.</span>
          </h2>

          <p className="text-base sm:text-xl text-[var(--foreground-muted)] leading-relaxed mb-10 max-w-xl mx-auto">
            Every hour you wait, a competitor with AI is responding to leads that should have been yours.
            Start today. First lead captured before you finish your chai.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold rounded-2xl text-base px-9 py-4 text-[#07070f] active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)", boxShadow: "0 0 40px rgba(245,158,11,0.4)" }}
            >
              <Zap size={16} />
              Start free trial
              <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:nihilkaarthikeyan@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-2xl text-base px-7 py-4 border border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-all"
            >
              <MessageCircle size={16} />
              Talk to us
            </a>
          </div>

          <p className="text-xs text-[var(--foreground-subtle)]">
            No credit card · No setup fees · Cancel anytime · 14-day free trial
          </p>

          {/* Feature chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              "✓ AI lead scoring",
              "✓ Voice AI agent",
              "✓ Auto follow-ups",
              "✓ WhatsApp capture",
              "✓ Property matching",
              "✓ Email alerts",
            ].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium text-[var(--foreground-muted)] bg-[var(--surface-2)] border border-[var(--border)]">
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
