"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CountUp({ end, prefix = "", suffix = "", duration = 2200 }: {
  end: number; prefix?: string; suffix?: string; duration?: number;
}) {
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

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { prefix: "₹", end: 18, suffix: "Cr+",  label: "Total deals closed",         sub: "across all agencies" },
  { prefix: "",  end: 2400, suffix: "+",   label: "Leads processed by AI",      sub: "and growing daily"   },
  { prefix: "",  end: 12,   suffix,         label: "Cities active in India",     sub: "north to south"      },
  { prefix: "",  end: 94,   suffix: "%",   label: "Agent satisfaction rate",     sub: "based on surveys"    },
  { prefix: "<", end: 2,    suffix: "s",   label: "AI analysis per lead",        sub: "from enquiry to CRM" },
];

export default function StatsBar() {
  return (
    <section className="landing-section px-4 sm:px-6 relative overflow-hidden">
      {/* gold glow behind */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">By the numbers</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            Results that speak for themselves
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="stat-card relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center card-glow overflow-hidden group"
            >
              {/* gold shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(245,158,11,0.06)_0%,transparent_70%)]" />

              <p className="text-3xl sm:text-4xl font-extrabold gold-text mb-2">
                <CountUp prefix={s.prefix} end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-xs font-semibold text-[var(--foreground)] leading-snug">{s.label}</p>
              <p className="text-[10px] text-[var(--foreground-subtle)] mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
