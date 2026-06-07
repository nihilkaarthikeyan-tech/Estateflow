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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/917598470890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#25d366] opacity-80 hover:opacity-100 transition-opacity"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp
          </a>
          <Link
            href="/login"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-75 hover:opacity-100 transition-opacity"
          >
            Login
          </Link>
          <a href="#contact" className="btn-oval">
            Get Demo
          </a>
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
                <a
                  href="https://wa.me/917598470890"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#25d366] opacity-80 hover:opacity-100 transition-opacity text-center py-2"
                >
                  WhatsApp Us
                </a>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] opacity-75 hover:opacity-100 transition-opacity text-center py-2"
                >
                  Login
                </Link>
                <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-oval text-center">
                  Get Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
