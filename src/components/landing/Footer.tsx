import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const FOOTER_BG = "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1920&q=80";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] px-6 sm:px-12 pt-16 pb-10 bg-[var(--background)] relative overflow-hidden">
      {/* City skyline ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={FOOTER_BG}
          alt=""
          fill
          className="object-cover object-bottom opacity-[0.07]"
          sizes="100vw"
          aria-hidden
        />
        {/* Gradient to fade image at top so it doesn't bleed into content above */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Elyse-style footer — 3 columns with parenthesized labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

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

          {/* Platform Links */}
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

          {/* Portal Links */}
          <div>
            <p className="section-label mb-6">(Portals)</p>
            <ul className="space-y-3">
              {[
                { label: "Property Listings",  href: "/listings" },
                { label: "Submit Requirement", href: "/submit-lead" },
                { label: "Book a Site Visit",  href: "/book-visit" },
                { label: "Tenant Portal",      href: "/tenant-portal" },
                { label: "Agent Login",        href: "/login" },
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
