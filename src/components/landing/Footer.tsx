import Link from "next/link";
import { Building2, Twitter, Linkedin, Github, Mail } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features",     href: "#features" },
      { label: "How it works", href: "#workflow" },
      { label: "FAQ",          href: "#faq" },
      { label: "Contact",      href: "#contact" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "AI Lead Scoring",  href: "#features" },
      { label: "Voice AI Agent",   href: "#features" },
      { label: "CRM Dashboard",    href: "#features" },
      { label: "Analytics",        href: "#features" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Sign in",  href: "/login" },
      { label: "Sign up",  href: "/signup" },
      { label: "Privacy",  href: "#" },
      { label: "Terms",    href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-4 sm:px-6 pt-16 pb-10 relative bg-[var(--surface)]/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "0 4px 16px var(--accent-glow)" }}
              >
                <Building2 size={16} className="text-white" />
              </div>
              <span className="text-sm font-extrabold text-[var(--foreground)]">
                EstateFlow <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--foreground-muted)] max-w-xs mb-6">
              The AI-powered CRM built for modern real estate agencies across India.
              Capture, score and close more leads — automatically.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter,  href: "#", label: "Twitter"  },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github,   href: "#", label: "GitHub"   },
                { icon: Mail,     href: "mailto:nihilkaarthikeyan@gmail.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground-subtle)] hover:text-[var(--foreground)] hover:bg-white/[0.06] border border-[var(--border)] transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)] mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} EstateFlow AI. All rights reserved.
          </p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            Built with Next.js · Supabase · OpenAI · Vapi.ai
          </p>
        </div>
      </div>
    </footer>
  );
}
