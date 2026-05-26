import Link from "next/link";
import Image from "next/image";
import { Building2, Zap, Shield, BarChart3 } from "lucide-react";

const AUTH_BG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

const features = [
  { icon: Zap, text: "AI-powered lead analysis in seconds" },
  { icon: BarChart3, text: "Smart pipeline & conversion tracking" },
  { icon: Shield, text: "Multi-tenant, enterprise-grade security" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #030712 0%, #0a0f1e 40%, #111827 100%)",
          }}
        />
        {/* Property background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={AUTH_BG}
            alt=""
            fill
            className="object-cover object-center opacity-[0.22]"
            sizes="55vw"
            aria-hidden
            priority
          />
        </div>
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, var(--accent-hover) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-auto">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                boxShadow: "0 8px 24px var(--accent-glow)",
              }}
            >
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white leading-none">
                Estate<span className="gradient-text">Flow</span>
              </span>
              <span className="ml-2 text-xs font-semibold tracking-wider text-[var(--accent-light)] uppercase">
                AI
              </span>
            </div>
          </Link>

          <div className="py-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
              style={{
                background: "var(--accent-muted)",
                border: "1px solid var(--border-accent)",
                color: "var(--accent-light)",
              }}
            >
              <Zap size={11} />
              AI-Powered Real Estate CRM
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-4">
              Close more deals, <span className="gradient-text">faster.</span>
            </h2>
            <p className="text-base text-[var(--foreground-muted)] leading-relaxed max-w-sm">
              The intelligent CRM that turns raw lead messages into structured insights,
              matched properties, and automated follow-ups.
            </p>

            <div className="flex flex-col gap-4 mt-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--accent-muted)",
                      border: "1px solid var(--border-accent)",
                    }}
                  >
                    <f.icon size={14} style={{ color: "var(--accent-light)" }} />
                  </div>
                  <span className="text-sm text-[var(--foreground-muted)]">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-auto rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed italic mb-3">
              &ldquo;EstateFlow AI cut our lead response time from hours to minutes. Our
              conversion rate went up 40% in the first month.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                }}
              >
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)]">Arjun Mehta</p>
                <p className="text-[10px] text-[var(--foreground-subtle)]">
                  MD, Prestige Properties, Mumbai
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[var(--surface)]">
        <div className="lg:hidden h-16 flex items-center px-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                boxShadow: "0 4px 12px var(--accent-glow)",
              }}
            >
              <Building2 size={15} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">
              Estate<span className="gradient-text">Flow</span>
              <span className="ml-1 text-[10px] font-semibold tracking-wider text-[var(--accent)] uppercase">
                AI
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        <p className="text-center text-xs text-[var(--foreground-subtle)] pb-6">
          © 2026 EstateFlow AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
