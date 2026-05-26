"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const testimonials = [
  {
    quote: "Our response time dropped from 3 hours to under a minute. The AI reads the lead and tells my agent exactly what to say. We closed 6 extra deals in our first month — that's ₹11L extra commission.",
    name: "Rajesh Menon",
    role: "Sr. Sales Manager, Prestige Homes",
    city: "Bangalore",
    result: "+6 deals · Month 1",
    initials: "RM",
  },
  {
    quote: "The AI chatbot handles enquiries at midnight while I sleep. I wake up to fully scored leads with budget, location and urgency already extracted. My team now works smarter, not harder.",
    name: "Kavitha Subramaniam",
    role: "Director, KVS Properties",
    city: "Chennai",
    result: "3× leads converted",
    initials: "KS",
  },
  {
    quote: "I was sceptical about AI. But EstateFlow actually understands Indian real estate. The property matching is scary accurate. Our voice agent on the website books site visits on its own now.",
    name: "Aditya Shah",
    role: "Founder, Prime Estates Mumbai",
    city: "Mumbai",
    result: "₹4Cr pipeline · 6 weeks",
    initials: "AS",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            (Real Results)
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight tracking-[-0.02em]"
          >
            Agents across India<br />
            <em className="font-normal" style={{ fontStyle: "italic" }}>are winning more deals</em>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="bg-[var(--background)] hover:bg-[var(--surface)] transition-colors duration-300 p-8 sm:p-10 flex flex-col gap-6"
            >
              {/* Large quote mark — serif italic gold */}
              <div className="font-serif text-6xl leading-none text-[rgba(201,169,110,0.25)]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}>
                &ldquo;
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed flex-1 -mt-3">
                {t.quote}
              </p>

              {/* Result */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[var(--gold)]" />
                <span className="text-[11px] font-semibold text-[var(--gold)] uppercase tracking-[0.1em]">{t.result}</span>
              </div>

              {/* Author */}
              <div className="pt-5 border-t border-[rgba(255,255,255,0.07)] flex items-center gap-4">
                <div className="w-9 h-9 rounded-full border border-[rgba(201,169,110,0.4)] flex items-center justify-center text-[11px] font-bold text-[var(--gold)] shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-px bg-[rgba(255,255,255,0.03)] grid grid-cols-2 md:grid-cols-4"
        >
          {[
            { value: "2,400+", label: "Leads processed" },
            { value: "₹18Cr+", label: "Deals closed" },
            { value: "94%",    label: "Agent satisfaction" },
            { value: "< 90s",  label: "Avg. response time" },
          ].map((s, i) => (
            <div key={s.label}
              className={`px-8 py-6 ${i < 3 ? "border-r border-[rgba(255,255,255,0.06)]" : ""} ${i < 2 ? "border-b md:border-b-0 border-[rgba(255,255,255,0.06)]" : ""}`}>
              <p className="font-serif text-2xl font-bold text-[var(--gold)]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {s.value}
              </p>
              <p className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-[0.1em] mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
