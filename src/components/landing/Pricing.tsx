"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";

const plans = [
  {
    name: "Starter",
    price: "AED 149",
    period: "/month",
    description: "For lean brokerages and growing lead volumes.",
    features: [
      "Up to 100 leads / month",
      "10 active listings",
      "AI lead scoring",
      "2 agents",
      "Standard analytics",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "AED 399",
    period: "/month",
    description: "For high-volume teams that need automation and WhatsApp integration.",
    features: [
      "Unlimited leads",
      "Unlimited properties",
      "AI recommendations",
      "10 agents",
      "Workflow automation",
      "Advanced analytics",
      "WhatsApp capture",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large brokerages, developers and channel partner networks.",
    features: [
      "Everything in Pro",
      "Unlimited agents",
      "Dedicated onboarding",
      "Custom AI workflows",
      "White label options",
      "SLA & account support",
    ],
    cta: "Book a demo",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Pricing"
          title="Transparent pricing that scales with your agency"
          description="Choose the plan that fits your team. Every plan includes AI lead capture from Bayut, Property Finder & WhatsApp, Arabic + English replies and automated follow-ups."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={cn(
                "pricing-card",
                plan.highlighted && "pricing-card--highlight relative"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--accent)] text-white shadow-lg">
                  Most popular
                </span>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-3">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[var(--foreground-muted)]">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">{plan.description}</p>
              </div>

              <div className="h-px my-6 bg-[var(--border)]" />

              <ul className="flex flex-col gap-3 flex-1 min-h-[220px]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--foreground-muted)]">
                    <Check
                      size={14}
                      className={cn(
                        "shrink-0 mt-0.5",
                        plan.highlighted ? "text-[var(--accent-light)]" : "text-[var(--foreground-subtle)]"
                      )}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none text-sm px-6 py-3",
                  plan.highlighted
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_28px_var(--accent-glow)] active:scale-[0.98]"
                    : "bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:border-[var(--border-accent)] active:scale-[0.98]"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--foreground-subtle)] mt-10">
          14-day trial included on all plans · No credit card required
        </p>
      </div>
    </section>
  );
}
