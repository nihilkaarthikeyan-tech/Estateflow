import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] px-6 sm:px-12 pt-16 pb-10 bg-[var(--background)]">
      <div className="max-w-[1400px] mx-auto">

        {/* Elyse-style footer — 3 columns with parenthesized labels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">

          {/* Brand — big serif name like Elyse */}
          <div className="sm:col-span-1">
            <p className="section-label mb-4">(Get in Touch)</p>
            <Link href="/" className="block mb-6">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", letterSpacing: "-0.02em" }}>
                EstateFlow
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              The AI-powered CRM built for modern real estate agencies across India.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-label mb-6">(Platform)</p>
            <ul className="space-y-3">
              {[
                { label: "AI Lead Scoring",  href: "#features" },
                { label: "WhatsApp Capture", href: "#features" },
                { label: "Voice AI Agent",   href: "#features" },
                { label: "Analytics",        href: "#features" },
                { label: "How it Works",     href: "#workflow" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label mb-6">(Contact)</p>
            <div className="space-y-2">
              <a href="mailto:nihilkaarthikeyan@gmail.com"
                className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                <Mail size={13} />
                nihilkaarthikeyan@gmail.com
              </a>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em]">Quick links</p>
              <div className="flex gap-4">
                <Link href="/login" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Sign in</Link>
                <Link href="/signup" className="text-sm text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">Get Demo →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[rgba(255,255,255,0.07)]">
          <p className="text-xs text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} EstateFlow AI. All rights reserved.
          </p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            Built for Indian real estate · Powered by OpenAI · Vapi.ai · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
