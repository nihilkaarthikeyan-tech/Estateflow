"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Brain, Bell, CheckCircle2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── mini dashboard data ── */
const tableLeads = [
  { name: "Arjun Mehta",     type: "3BHK",  budget: "₹90L",   loc: "Chennai",    score: 94, stage: "New",       stageColor: "var(--accent)" },
  { name: "Priya Nair",      type: "Villa", budget: "₹1.4Cr", loc: "Bangalore",  score: 87, stage: "Contacted",  stageColor: "#818cf8" },
  { name: "Rohit Sharma",    type: "2BHK",  budget: "₹65L",   loc: "Hyderabad",  score: 72, stage: "Site Visit", stageColor: "var(--warning)" },
  { name: "Sneha Krishnan",  type: "Plot",  budget: "₹42L",   loc: "Coimbatore", score: 61, stage: "Qualified",  stageColor: "#a78bfa" },
];

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-0 overflow-hidden">
      {/* ── glow behind headline ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(91,110,245,0.2)_0%,transparent_60%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent-light)] bg-[var(--accent-muted)] border border-[var(--border-accent)] mb-8 badge-float">
          <Sparkles size={12} className="text-[var(--accent)]" />
          AI-powered CRM built for Indian real estate
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.07)}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--foreground)]"
        >
          The AI that closes{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text-animated">real estate deals</span>
          <br className="hidden sm:block" />
          {" "}while you sleep.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.13)}
          className="mt-6 text-base sm:text-xl leading-relaxed text-[var(--foreground-muted)] max-w-2xl mx-auto"
        >
          EstateFlow captures every WhatsApp enquiry, scores buyer intent with AI,
          matches properties and automates follow-ups — all in under 2 seconds.
          Your competitors are still doing this manually.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.18)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="glow-border w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold rounded-2xl text-base px-8 py-4 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-[0_0_32px_var(--accent-glow)] hover:shadow-[0_0_48px_var(--accent-glow)]"
          >
            Start free — no card needed
            <ArrowRight size={16} />
          </Link>
          <Link
            href="#workflow"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-2xl text-base px-7 py-4 border border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-all"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div {...fadeUp(0.22)} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <div className="flex -space-x-2">
            {["RM","KS","AS","RV","PM"].map((i, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-[9px] font-bold text-white">
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            <span className="font-bold text-[var(--foreground)]">50+ agencies</span> across{" "}
            <span className="font-bold text-[var(--foreground)]">12 Indian cities</span> trust EstateFlow
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          {...fadeUp(0.26)}
          className="mt-10 inline-grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--border)]"
        >
          {[
            { value: <><CountUp end={3} suffix="×" /></>, label: "leads converted" },
            { value: <>{"< 2s"}</>, label: "AI analysis" },
            { value: <><CountUp end={99} suffix=".8%" /></>, label: "uptime" },
          ].map((s, i) => (
            <div key={i} className="bg-[var(--surface)] px-8 py-4">
              <p className="text-2xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Full-width dashboard mockup ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease }}
        className="relative mt-16 max-w-6xl mx-auto px-4 sm:px-6"
      >
        {/* Fade-out at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="hero-mockup rounded-[1.5rem] border border-white/[0.12] overflow-hidden shadow-[0_48px_120px_-24px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-[var(--surface-2)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-lg bg-[var(--surface-3)] flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--success)]/60" />
              <span className="text-[10px] text-[var(--foreground-subtle)]">estateflow.app / dashboard / leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-[10px] font-semibold text-[var(--success)]">LIVE</span>
            </div>
          </div>

          {/* Dashboard inner */}
          <div className="bg-[var(--surface)] flex">
            {/* Sidebar */}
            <div className="hidden sm:flex w-48 shrink-0 flex-col gap-1 p-3 border-r border-white/[0.06] bg-[var(--surface-2)]">
              <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                  <TrendingUp size={12} className="text-white" />
                </div>
                <span className="text-xs font-bold text-[var(--foreground)]">EstateFlow</span>
              </div>
              {["Leads","Properties","Tenants","Analytics","Settings"].map((item, i) => (
                <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${i === 0 ? "bg-[var(--accent-muted)] text-[var(--accent-light)] font-semibold" : "text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[var(--accent)]" : "bg-white/20"}`} />
                  {item}
                  {item === "Leads" && <span className="ml-auto text-[9px] bg-[var(--accent)] text-white rounded-full px-1.5 py-0.5 font-bold">47</span>}
                </div>
              ))}
            </div>

            {/* Main area */}
            <div className="flex-1 p-4 sm:p-5 min-w-0">
              {/* Page header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Leads CRM</h2>
                  <p className="text-[10px] text-[var(--foreground-muted)]">47 total · 12 new today</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    <span className="text-[10px] font-semibold text-[var(--success)]">AI active</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-[10px] font-semibold">+ Add lead</div>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: "New",        count: 12, color: "var(--accent)" },
                  { label: "Contacted",  count: 8,  color: "#818cf8" },
                  { label: "Site Visit", count: 5,  color: "var(--warning)" },
                  { label: "Closed",     count: 3,  color: "var(--success)" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-[var(--surface-2)] px-3 py-2.5 text-center">
                    <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.count}</p>
                    <p className="text-[9px] text-[var(--foreground-subtle)] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-0 bg-[var(--surface-3)] px-4 py-2 border-b border-white/[0.06]">
                  {["Lead","Type","Budget","Location","Score","Stage"].map(h => (
                    <span key={h} className="text-[9px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-widest">{h}</span>
                  ))}
                </div>
                {tableLeads.map((lead, i) => (
                  <div key={i} className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.6fr_0.8fr] gap-0 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-[9px] font-bold text-white shrink-0">{lead.name[0]}</div>
                      <span className="text-[11px] font-medium text-[var(--foreground)] truncate">{lead.name}</span>
                    </div>
                    <span className="text-[11px] text-[var(--foreground-muted)]">{lead.type}</span>
                    <span className="text-[11px] font-semibold text-[var(--foreground)]">{lead.budget}</span>
                    <span className="text-[11px] text-[var(--foreground-muted)]">{lead.loc}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lead.score}%`, background: "linear-gradient(90deg, var(--accent), var(--cyan))" }} />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--foreground)]">{lead.score}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: lead.stageColor, background: `${lead.stageColor}18` }}>
                      {lead.stage}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI analysis strip */}
              <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                <Brain size={14} className="text-[var(--accent-light)] shrink-0" />
                <p className="text-[11px] text-[var(--accent-light)]">
                  <span className="font-bold">AI insight:</span> Arjun Mehta is showing high purchase intent. Recommend calling within 15 minutes and sharing 2 shortlisted properties.
                </p>
                <button className="shrink-0 text-[10px] font-semibold text-[var(--accent)] hover:underline">Act now →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating notification cards */}
        <div
          className="absolute top-16 -left-4 hidden lg:block"
          style={{ animation: "slide-in-left 0.8s ease 1s both" }}
        >
          <div className="glass-card rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 w-56">
            <div className="w-8 h-8 rounded-xl bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0">
              <Bell size={14} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--foreground)]">New lead captured</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">Arjun Mehta · 3BHK · ₹90L</p>
            </div>
          </div>
        </div>

        <div
          className="absolute top-16 -right-4 hidden lg:block"
          style={{ animation: "slide-in-right 0.8s ease 1.2s both" }}
        >
          <div className="glass-card rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 w-52">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
              <Brain size={14} className="text-[var(--accent-light)]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--foreground)]">AI scored lead</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">94 / 100 · High intent</p>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-44 -right-4 hidden lg:block"
          style={{ animation: "slide-in-right 0.8s ease 1.5s both" }}
        >
          <div className="glass-card rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 w-56">
            <div className="w-8 h-8 rounded-xl bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--foreground)]">Follow-up sent</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">Auto · 4 properties shared</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
