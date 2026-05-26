"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

// Free Unsplash luxury property photo — like Elyse contact section
const CONTACT_IMG = "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", agency: "", phone: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="section-rule">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
        >
          (Get Started)
        </motion.p>
      </div>

      {/* Split layout — exactly like Elyse contact: photo left, form panel right */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">

        {/* Left — property photo with text overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[480px] lg:min-h-[700px] overflow-hidden"
        >
          <Image
            src={CONTACT_IMG}
            alt="Luxury property"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,15,14,0.3)] to-[rgba(13,15,14,0.5)]" />

          {/* Text overlay — left bottom */}
          <div className="absolute bottom-12 left-10 right-10">
            <p className="section-label text-white/50 mb-4">(Why EstateFlow)</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Close More Deals,<br />
              <em className="font-normal" style={{ fontStyle: "italic" }}>Work Less Hours.</em>
            </h2>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
              Schedule a private demo and see how EstateFlow transforms your agency&apos;s lead-to-close process.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-white/50 uppercase tracking-[0.1em]">
              <span>✓ No card required</span>
              <span>✓ 14-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Right — forest green panel + form — like Elyse */}
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
                Our team will contact you within the hour.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-tight mb-2"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Start Your<br />
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>Free Trial</em>
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-10 tracking-[0.04em]">
                Our team will set you up within the hour.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { field: "name",   label: "Full Name",   type: "text",  placeholder: "Rajesh Menon",          required: true },
                  { field: "email",  label: "Email",       type: "email", placeholder: "rajesh@agency.com",      required: true },
                  { field: "phone",  label: "Phone",       type: "tel",   placeholder: "+91 98765 43210",        required: true },
                  { field: "agency", label: "Agency Name", type: "text",  placeholder: "Prestige Homes",         required: false },
                ].map(({ field, label, type, placeholder, required }) => (
                  <div key={field}>
                    <label className="input-label">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className="input-underline"
                      required={required}
                    />
                  </div>
                ))}

                <button type="submit"
                  className="w-full mt-4 py-4 rounded-full bg-[var(--foreground)] text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold)] transition-colors duration-200">
                  Request Access
                </button>
              </form>

              <p className="text-[10px] text-[var(--foreground-subtle)] mt-6 text-center">
                By submitting, you agree to our privacy policy.
                We promise to keep your information safe and secure.
              </p>
              <p className="text-[11px] text-center mt-4">
                <Link href="/login" className="text-[var(--gold)] hover:underline">Already have an account? Sign in →</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
