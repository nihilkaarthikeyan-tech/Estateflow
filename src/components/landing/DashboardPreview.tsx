"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  BarChart3,
  Bell,
  TrendingUp,
  Flame,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: Building2, label: "Properties" },
  { icon: Calendar, label: "Visits" },
  { icon: BarChart3, label: "Analytics" },
];

const stats = [
  { label: "New Leads", value: "47", trend: "+12%" },
  { label: "Hot Leads", value: "13", trend: "+5" },
  { label: "Visits Booked", value: "9", trend: "+3" },
  { label: "Pipeline", value: "AED 18.4M", trend: "+22%" },
];

const leads = [
  { name: "Ahmed Al-Mansouri", area: "Dubai Marina · 2BR", budget: "AED 2.4M", score: 94, tag: "Hot" },
  { name: "Sarah Khan", area: "Downtown · 1BR", budget: "AED 1.8M", score: 81, tag: "Warm" },
  { name: "Viktor Petrov", area: "Palm Jumeirah · Villa", budget: "AED 9.5M", score: 97, tag: "Golden Visa" },
  { name: "Priya Sharma", area: "JVC · Studio", budget: "AED 880K", score: 63, tag: "New" },
];

function scoreColor(score: number) {
  if (score >= 90) return "#f87171";
  if (score >= 75) return "#c9a96e";
  return "#8a847a";
}

export default function DashboardPreview() {
  return (
    <section id="product" className="section-rule landing-section px-6 sm:px-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-14 sm:mb-16 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (Inside EstateFlow)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            One dashboard for your<br />
            <em className="font-normal" style={{ fontStyle: "italic" }}>entire pipeline</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm text-[var(--foreground-muted)] max-w-md mx-auto leading-relaxed"
          >
            Every lead from Bayut, Property Finder and WhatsApp — scored, staged and
            ready for your agents. This is what your team sees every morning.
          </motion.p>
        </div>

        {/* Dashboard mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-[var(--background)]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-[11px] text-[var(--foreground-subtle)] font-mono">
              app.estateflow.ae/dashboard
            </span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-1 w-48 shrink-0 border-r border-[var(--border)] p-4 bg-[var(--background)]">
              <div className="flex items-center gap-2 px-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)" }}>
                  <Building2 size={14} className="text-[#131816]" />
                </div>
                <span className="text-sm font-bold text-[var(--foreground)]">EstateFlow</span>
              </div>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    item.active
                      ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                      : "text-[var(--foreground-muted)]"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="flex-1 p-5 sm:p-6 min-w-0">
              {/* Greeting row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)]">Good morning, Omar 👋</p>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                    You have 13 hot leads waiting
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell size={16} className="text-[var(--foreground-muted)]" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--gold)] text-[8px] font-bold text-[#131816] flex items-center justify-center">
                      5
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[var(--surface-3)] border border-[var(--border-strong)] flex items-center justify-center text-[10px] font-bold text-[var(--gold)]">
                    OA
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5"
                  >
                    <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-[0.08em]">
                      {s.label}
                    </p>
                    <div className="flex items-end justify-between mt-1.5">
                      <p className="text-lg font-bold text-[var(--foreground)] leading-none">{s.value}</p>
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                        <TrendingUp size={10} />
                        {s.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leads table */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-xs font-bold text-[var(--foreground)]">Recent Leads</p>
                  <span className="text-[10px] text-[var(--gold)]">AI-scored · live</span>
                </div>
                {leads.map((lead, i) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i < leads.length - 1 ? "border-b border-[var(--border)]" : ""
                    }`}
                  >
                    {/* Score ring */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        color: scoreColor(lead.score),
                        border: `2px solid ${scoreColor(lead.score)}`,
                      }}
                    >
                      {lead.score}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--foreground)] truncate">{lead.name}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] truncate">{lead.area}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-[var(--foreground)]">{lead.budget}</p>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.06em] mt-0.5"
                        style={{ color: scoreColor(lead.score) }}
                      >
                        {lead.tag === "Hot" && <Flame size={9} />}
                        {lead.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-[var(--foreground-subtle)] mt-6"
        >
          Live demo · Your agency&apos;s version is fully branded and customised
        </motion.p>
      </div>
    </section>
  );
}
