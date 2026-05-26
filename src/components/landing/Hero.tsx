"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

      {/* ── Background: dark charcoal + very subtle property-feel gradient ── */}
      <div className="absolute inset-0 bg-[var(--background)]" />

      {/* Warm gold radial at top */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(201,169,110,0.08),transparent)]" />

      {/* Forest green bottom glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_80%_70%_at_100%_100%,rgba(22,42,34,0.6),transparent)]" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* ── Top-right corner content — like Elyse "HOLISTIC LUXURY IN PERFECT HARMONY" ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease }}
        className="absolute top-32 right-8 sm:right-16 max-w-xs text-right hidden sm:block"
      >
        <p className="font-serif italic text-base sm:text-lg text-[var(--foreground)] leading-snug mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          AI that closes deals<br />
          <em>while you sleep.</em>
        </p>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
          EstateFlow reads every WhatsApp enquiry, scores buyer intent
          in 2 seconds, and sends the first follow-up — automatically.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-[11px] text-[var(--success)] uppercase tracking-[0.12em]">Live · 50+ agencies</span>
        </div>
      </motion.div>

      {/* ── Massive display headline — fills bottom of viewport like ELYSE ── */}
      <div className="relative z-10 px-6 sm:px-12 pb-16 sm:pb-20">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-6 sm:mb-8"
        >
          (AI-Powered Real Estate CRM)
        </motion.p>

        {/* Giant serif headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-bold leading-[0.88] tracking-[-0.02em] text-[var(--foreground)]"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
            }}
          >
            Never Lose
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic font-400 leading-[0.88] tracking-[-0.02em] text-[var(--foreground)]"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
            }}
          >
            a Hot Lead
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-bold leading-[0.88] tracking-[-0.02em] text-[var(--foreground)]"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
            }}
          >
            Again.
          </motion.h1>
        </div>

        {/* Bottom row — CTA + trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10"
        >
          <Link href="/signup" className="btn-oval btn-oval-filled text-sm px-8 py-3.5">
            Start Free Trial
          </Link>
          <Link href="#workflow" className="btn-oval text-sm px-8 py-3.5">
            See How It Works
          </Link>

          {/* Thin vertical divider */}
          <div className="hidden sm:block w-px h-8 bg-[rgba(255,255,255,0.12)]" />

          {/* Trust */}
          <div className="flex items-center gap-6 text-[11px] text-[var(--foreground-muted)] uppercase tracking-[0.1em]">
            <span>No card required</span>
            <span className="opacity-40">·</span>
            <span>14-day free trial</span>
            <span className="opacity-40">·</span>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom rule ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(255,255,255,0.07)]" />

      {/* ── Scroll indicator — like Elyse ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--foreground-subtle)] to-transparent" />
      </motion.div>
    </section>
  );
}
