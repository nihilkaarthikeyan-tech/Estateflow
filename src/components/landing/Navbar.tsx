"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ",          href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-3 sm:pt-4">
        <div className={cn(
          "rounded-2xl border transition-all duration-300",
          scrolled
            ? "glass border-[var(--border)] shadow-xl shadow-black/40"
            : "border-transparent bg-[rgba(7,7,15,0.65)] backdrop-blur-xl"
        )}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 h-14 px-4 sm:px-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 min-w-0 justify-self-start">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", boxShadow: "0 4px 14px rgba(139,92,246,0.5)" }}>
                <Building2 size={14} className="text-white" />
              </div>
              <span className="text-sm font-extrabold text-[var(--foreground)] truncate">
                EstateFlow <span className="gradient-text">AI</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center justify-center gap-0.5 justify-self-center">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/[0.05] transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-2.5 justify-self-end">
              <Link href="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/[0.05] transition-colors">
                Sign in
              </Link>
              {/* Gold "Get Demo" button */}
              <Link href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl text-[#07070f] transition-all active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)", boxShadow: "0 0 20px rgba(245,158,11,0.35)" }}>
                Get Demo
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button type="button"
              className="md:hidden justify-self-end col-start-3 w-9 h-9 flex items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}>
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              className="mt-2 rounded-2xl glass overflow-hidden md:hidden">
              <div className="p-3 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/5 transition-colors">
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 pt-3 mt-1 border-t border-[var(--border)]">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/5 transition-colors">
                    Sign in
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-bold rounded-xl text-[#07070f]"
                    style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}>
                    Get Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
