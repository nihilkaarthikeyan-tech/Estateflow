"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Results",      href: "#testimonials" },
  { label: "Listings",     href: "/listings" },
  { label: "FAQ",          href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "glass border-b border-[rgba(255,255,255,0.06)]"
        : "bg-gradient-to-b from-[rgba(13,15,14,0.72)] to-transparent"
    )}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 min-w-0">
          <span className="font-serif text-lg font-700 tracking-[0.12em] uppercase text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 700, letterSpacing: "0.12em" }}>
            EstateFlow
          </span>
        </Link>

        {/* Nav links — centered */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-75 hover:opacity-100 transition-opacity">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA — oval pill like Elyse */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/tenant-portal"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-65 hover:opacity-100 transition-opacity">
            Tenant Portal
          </Link>
          <Link href="/login"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity">
            Agent Login
          </Link>
          <Link href="/signup" className="btn-oval">
            Get Demo
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button type="button"
          className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            className="md:hidden glass border-t border-[rgba(255,255,255,0.06)]">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-75 hover:opacity-100 transition-opacity py-2">
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-col gap-3">
                <Link href="/tenant-portal" onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-65 text-center py-2">
                  Tenant Portal
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-80 text-center py-2">
                  Agent Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-oval text-center">
                  Get Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
