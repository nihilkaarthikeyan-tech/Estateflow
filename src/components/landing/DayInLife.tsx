"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, CheckCircle2, MessageCircle, Brain, Bell, Calendar, TrendingUp } from "lucide-react";

const DAYINLIFE_BG = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80";

const ease = [0.22, 1, 0.36, 1] as const;

const timeline = [
  {
    time: "7:02 AM",
    event: "Buyer WhatsApps at midnight",
    detail: '"Hi, looking for 3BHK ready to move in Chennai, budget ₹90L. Urgent."',
    without: {
      text: "You see it at 9:30 AM. Buyer already signed with competitor at 8 AM.",
      sub: "Lead lost. ₹1.8L commission gone.",
      color: "#ef4444",
    },
    with: {
      text: "AI replied in 4 seconds. Scored 94/100. 2 matching properties sent. Follow-up queued.",
      sub: "You wake up to a warm lead ready for site visit.",
      color: "#16a34a",
    },
    icon: MessageCircle,
    iconColor: "#c9a96e",
  },
  {
    time: "9:00 AM",
    event: "3 more enquiries come in",
    detail: "Rohit — 2BHK · Priya — Villa · Sneha — Plot. All from different sources.",
    without: {
      text: "Agent manually copies each into Excel. 45 minutes wasted. 1 enquiry missed.",
      sub: "₹0 revenue from 45 minutes of data entry.",
      color: "#ef4444",
    },
    with: {
      text: "All 3 auto-imported, scored, and prioritised. Rohit at top: 87/100, call him first.",
      sub: "Agent spends 45 min on calls instead. 2 site visits booked.",
      color: "#16a34a",
    },
    icon: Brain,
    iconColor: "#c9a96e",
  },
  {
    time: "11:30 AM",
    event: "Yesterday's lead goes cold",
    detail: "You followed up once. They haven't replied. You have 40 other leads to manage.",
    without: {
      text: "Lead goes cold. You forget. They sign elsewhere after the 5th follow-up… from someone else.",
      sub: "Research shows 80% of deals close after 5+ follow-ups.",
      color: "#ef4444",
    },
    with: {
      text: "EstateFlow sends follow-up 2, 3, 4, 5 automatically at the right intervals via WhatsApp.",
      sub: "Lead re-engages. Site visit scheduled. Deal progressing.",
      color: "#16a34a",
    },
    icon: Bell,
    iconColor: "#c9a96e",
  },
  {
    time: "4:00 PM",
    event: "Site visit is today",
    detail: "Buyer walks in. You need to know their exact requirements to close.",
    without: {
      text: "Scrambling through WhatsApp chats for budget, requirements. Looks unprepared.",
      sub: "Buyer loses confidence. Deal falls through.",
      color: "#ef4444",
    },
    with: {
      text: "AI brief ready: budget ₹90L, prefers top floor, kids' school nearby, loan pre-approved.",
      sub: "You walk in confident. Buyer impressed. Deal moves to negotiation.",
      color: "#16a34a",
    },
    icon: Calendar,
    iconColor: "#c9a96e",
  },
  {
    time: "6:00 PM",
    event: "End of day — count your deals",
    detail: "What did today actually produce?",
    without: {
      text: "3 hours on data entry. 2 leads gone cold. 0 new site visits. 1 deal lost at 7 AM.",
      sub: "Revenue opportunity lost: ₹3.2L+ in commission.",
      color: "#ef4444",
    },
    with: {
      text: "4 site visits booked. 2 deals progressing. 1 offer accepted. AI running follow-ups overnight.",
      sub: "Revenue in pipeline: ₹11L+ commission. You leave at 6 PM.",
      color: "#16a34a",
    },
    icon: TrendingUp,
    iconColor: "#c9a96e",
  },
];

export default function DayInLife() {
  return (
    <section className="landing-section px-4 sm:px-6 relative overflow-hidden">
      {/* Property background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={DAYINLIFE_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.04]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      {/* Warm gold ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(201,169,110,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">A day in your life</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[var(--foreground)]">
            The exact hours you&apos;re losing money
            <br className="hidden sm:block" />
            <span className="gradient-text-animated"> — and how to get them back</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            This is a real estate agent&apos;s day. You&apos;ve lived this. Let&apos;s change it.
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] gap-4 mb-6">
          <div />
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]">
            <div className="w-7 h-7 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center shrink-0">
              <X size={14} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-400">Without EstateFlow</p>
              <p className="text-[10px] text-red-400/70 hidden sm:block">How most agents work today</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.2)]">
            <div className="w-7 h-7 rounded-full bg-[rgba(22,163,74,0.15)] flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400">With EstateFlow</p>
              <p className="text-[10px] text-emerald-400/70 hidden sm:block">Your new reality</p>
            </div>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="space-y-3">
          {timeline.map((row, i) => (
            <motion.div
              key={row.time}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease }}
              className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] gap-4 items-start"
            >
              {/* Time + event */}
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.25)" }}>
                    <row.icon size={12} style={{ color: row.iconColor }} />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--accent)]">{row.time}</span>
                </div>
                <p className="text-[10px] text-[var(--foreground-subtle)] leading-snug pl-8 hidden sm:block">{row.event}</p>
              </div>

              {/* Without */}
              <div className="p-4 rounded-2xl bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.12)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/40 to-transparent" />
                <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--foreground-muted)] mb-2">{row.without.text}</p>
                <p className="text-[10px] font-semibold text-red-400">{row.without.sub}</p>
              </div>

              {/* With */}
              <div className="p-4 rounded-2xl bg-[rgba(22,163,74,0.05)] border border-[rgba(22,163,74,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--foreground-muted)] mb-2">{row.with.text}</p>
                <p className="text-[10px] font-semibold text-emerald-400">{row.with.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 rounded-3xl border relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(22,163,74,0.05) 100%)",
            borderColor: "rgba(201,169,110,0.24)",
          }}
        >
          {/* Property image — right third, visible on sm+ */}
          <div className="hidden sm:block absolute inset-y-0 right-0 w-[38%] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
              alt=""
              fill
              className="object-cover object-center opacity-20"
              sizes="38vw"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse,rgba(201,169,110,0.1)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 items-center p-6 sm:p-8">
            <div className="sm:col-span-2">
              <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)] mb-2">
                The difference isn&apos;t talent. It&apos;s the system.
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">
                Top agents in India aren&apos;t working harder — they&apos;re working smarter. EstateFlow is the
                unfair advantage your competitors don&apos;t want you to have.
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-3xl font-extrabold gradient-text">₹11L+</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">Extra commission in pipeline<br/>per agent, per month</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
