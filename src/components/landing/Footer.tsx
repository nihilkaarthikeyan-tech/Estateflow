import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const WA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const FOOTER_BG = "https://images.unsplash.com/photo-1590264539175-39df72442833?auto=format&fit=crop&w=1920&q=80";

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
              The AI-powered CRM built for modern real estate agencies across the UAE.
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
            <div className="space-y-3">
              <a href="mailto:nihilkaarthikeyan@gmail.com"
                className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                <Mail size={13} />
                nihilkaarthikeyan@gmail.com
              </a>
              <a
                href="https://wa.me/917598470890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex items-center gap-2 text-sm text-[#25d366] hover:opacity-80 transition-opacity"
              >
                {WA_ICON}
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-[11px] text-[var(--foreground-subtle)] uppercase tracking-[0.1em]">Quick links</p>
              <div className="flex gap-4">
                <Link href="/login" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Agency Login</Link>
                <a href="#contact" className="text-sm text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">Get Demo →</a>
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
            Built for UAE real estate · Powered by OpenAI · Vapi.ai · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
