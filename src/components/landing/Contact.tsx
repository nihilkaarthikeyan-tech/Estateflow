"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", agency: "", phone: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mailto fallback — replace with your actual endpoint
    setSent(true);
  };

  return (
    <section id="contact" className="section-rule landing-section px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label mb-12"
        >
          (Get Started)
        </motion.p>

        {/* Split layout — like Elyse contact section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">

          {/* Left — editorial content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="bg-[var(--background)] p-10 sm:p-16 flex flex-col justify-between gap-12"
          >
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-[0.9] tracking-[-0.02em] mb-8"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Start Closing<br />
                <em className="font-normal" style={{ fontStyle: "italic" }}>More Deals</em><br />
                Today.
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
                Right now, a buyer just messaged. Are you going to reply in 3 hours — or in 4 seconds?
                The agent who replies first wins. Always.
              </p>
            </div>

            {/* Trust signals */}
            <div className="space-y-3">
              {[
                "No credit card required",
                "Set up in under 10 minutes",
                "14-day free trial",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                  <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-[0.1em]">{item}</span>
                </div>
              ))}
            </div>

            {/* Already have account */}
            <p className="text-xs text-[var(--foreground-subtle)]">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--gold)] hover:underline">Sign in →</Link>
            </p>
          </motion.div>

          {/* Right — forest green panel with form, like Elyse */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="forest-panel p-10 sm:p-16"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <p className="font-serif text-3xl font-bold text-[var(--foreground)] mb-4"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  We&apos;ll be in touch.
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Our team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-tight mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  Start Your<br />
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>Free Trial</em>
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mb-10">Our team will set you up within the hour.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {[
                    { field: "name",   label: "Full Name",    type: "text",  placeholder: "Rajesh Menon" },
                    { field: "email",  label: "Email",        type: "email", placeholder: "rajesh@agency.com" },
                    { field: "phone",  label: "Phone",        type: "tel",   placeholder: "+91 98765 43210" },
                    { field: "agency", label: "Agency Name",  type: "text",  placeholder: "Prestige Homes" },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="input-label">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="input-underline"
                        required={field !== "agency"}
                      />
                    </div>
                  ))}

                  <button type="submit"
                    className="w-full btn-oval btn-oval-filled mt-4 text-sm py-4 font-semibold tracking-[0.16em]">
                    Request Access
                  </button>
                </form>

                <p className="text-[10px] text-[var(--foreground-subtle)] mt-6 text-center">
                  By submitting, you agree to our privacy policy. We promise to keep your information safe.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
