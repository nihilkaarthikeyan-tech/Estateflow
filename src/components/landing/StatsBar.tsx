"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Free Unsplash luxury exterior shot
const STATS_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80";

function CountUp({ end, prefix = "", suffix = "", duration = 2000 }: {
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
  { value: 18,   prefix: "₹", suffix: "Cr+", label: "Total deals closed",    sub: "across all agencies" },
  { value: 2400, prefix: "",  suffix: "+",   label: "Leads processed by AI",  sub: "and growing daily" },
  { value: 12,   prefix: "",  suffix: "",    label: "Cities across India",     sub: "north to south" },
  { value: 94,   prefix: "",  suffix: "%",   label: "Agent satisfaction",      sub: "based on surveys" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function StatsBar() {
  return (
    <section className="section-rule relative overflow-hidden">

      {/* Full-bleed property photo as section background */}
      <div className="absolute inset-0">
        <Image
          src={STATS_IMG}
          alt="Luxury real estate"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Heavy dark overlay — text must be legible */}
        <div className="absolute inset-0 bg-[rgba(13,15,14,0.88)]" />
      </div>

      <div className="relative z-10 px-6 sm:px-12 py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto">

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-label mb-16 sm:mb-24 text-white/40"
          >
            (Results)
          </motion.p>

          {/* Giant scattered stats — like Elyse: 60% · 30 · 150k · 24/7 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 sm:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
                className={i % 2 === 1 ? "md:mt-16" : ""}
              >
                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "clamp(3.5rem, 8vw, 7rem)",
                    fontWeight: 700,
                    lineHeight: 0.85,
                    color: "white",
                  }}
                >
                  <CountUp prefix={s.prefix} end={s.value} suffix={s.suffix} duration={2200} />
                </p>
                <p className="mt-4 text-sm text-white/80 font-medium leading-snug">{s.label}</p>
                <p className="mt-1 text-xs text-white/40">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Italic quote — like Elyse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 sm:mt-28 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <p className="font-serif italic text-xl sm:text-2xl text-white/50 max-w-lg leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              &ldquo;The AI that works while you sleep — and closes while you talk.&rdquo;
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/40 uppercase tracking-[0.14em]">Live across 12 Indian cities</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
