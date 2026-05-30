"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

// Free Unsplash luxury real estate images — no API key needed
const HERO_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80";

export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen flex flex-col justify-end overflow-hidden">

      {/* ── Full-bleed property photo — like Elyse ── */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Luxury property"
          fill
          priority
          className="hero-bg-img object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay — so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,15,14,0.55)] via-[rgba(13,15,14,0.45)] to-[rgba(13,15,14,0.92)]" />
        {/* Subtle warm gold tint at top */}
        <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-[rgba(201,169,110,0.08)] to-transparent" />
      </div>

      {/* ── Top-right content — like Elyse "HOLISTIC LUXURY IN PERFECT HARMONY" ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
        className="absolute top-28 right-8 sm:right-16 max-w-[280px] text-right hidden sm:block"
      >
        <p className="font-serif italic text-base sm:text-lg text-white leading-snug mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          AI that closes deals<br />
          <em>while you sleep.</em>
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          EstateFlow reads every WhatsApp enquiry, scores buyer intent in 2 seconds,
          and sends the first follow-up — automatically.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 uppercase tracking-[0.12em]">Early access · India</span>
        </div>
      </motion.div>

      {/* ── Massive display headline — overlaid on photo like ELYSE ── */}
      <div className="relative z-10 px-6 sm:px-12 pb-16 sm:pb-20">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-6 sm:mb-8 text-white/50"
        >
          (AI-Powered Real Estate CRM)
        </motion.p>

        {/* Giant serif headline — clips over the photo */}
        <div className="hero-headline">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(2.6rem, 11vw, 11rem)",
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            Never Lose
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.6rem, 11vw, 11rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            a Hot Lead
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(2.6rem, 11vw, 11rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            Again.
          </motion.h1>
        </div>
        </div>{/* end hero-headline */}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8"
        >
          <Link href="/signup"
            className="inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-white text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold)] transition-colors duration-200">
            Start Free Trial
          </Link>
          <Link href="#features"
            className="inline-flex items-center justify-center px-9 py-3.5 rounded-full border border-white/40 text-white text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-white hover:bg-white/10 transition-colors duration-200">
            See How It Works
          </Link>

          <div className="hidden sm:block w-px h-8 bg-white/20" />
          <div className="flex items-center gap-5 text-[11px] text-white/50 uppercase tracking-[0.1em]">
            <span>No card required</span>
            <span className="opacity-40">·</span>
            <span>14-day trial</span>
            <span className="opacity-40">·</span>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
