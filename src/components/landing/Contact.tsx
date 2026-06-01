"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const CONTACT_IMG = "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=80";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", agency: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section section-rule">
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
            className="contact-bg-img object-cover object-center"
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
              Tell us about your agency. We&apos;ll show you exactly what we&apos;d build for you — no obligation.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-white/50 uppercase tracking-[0.1em]">
              <span>✓ Built for your agency</span>
              <span>✓ Reply within the hour</span>
              <span>✓ No commitment</span>
            </div>
          </div>
        </motion.div>

        {/* Right — forest green panel + form — like Elyse */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="forest-panel forest-panel-animate p-10 sm:p-16"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-14 h-14 rounded-full bg-[var(--gold-muted)] border border-[rgba(201,169,110,0.35)] flex items-center justify-center mb-6">
                <span className="text-2xl">✓</span>
              </div>
              <p className="font-serif text-3xl font-bold text-[var(--foreground)] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                We&apos;ll be in touch.
              </p>
              <p className="text-sm text-[var(--foreground-muted)] mb-6">
                Expect a WhatsApp or email from us within the hour.
              </p>
              <a
                href="https://wa.me/971XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25d366] text-white text-[11px] font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-tight mb-2"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Request a<br />
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>Free Demo</em>
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-10 tracking-[0.04em]">
                We&apos;ll show you the system live and discuss your agency&apos;s needs.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { field: "name",   label: "Full Name",   type: "text",  placeholder: "Ahmed Al-Mansouri",      required: true },
                  { field: "email",  label: "Email",       type: "email", placeholder: "ahmed@agency.ae",        required: true },
                  { field: "phone",  label: "WhatsApp / Phone", type: "tel", placeholder: "+971 50 123 4567",    required: true },
                  { field: "agency", label: "Agency Name", type: "text",  placeholder: "Prime Properties Dubai", required: false },
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

                <div>
                  <label className="input-label">What do you need? (optional)</label>
                  <textarea
                    placeholder="e.g. AI lead capture, Bayut integration, WhatsApp automation..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="input-underline resize-none"
                    rows={2}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full mt-4 py-4 rounded-full bg-[var(--foreground)] text-[var(--background)] text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-[var(--gold)] transition-colors duration-200 disabled:opacity-60">
                  {loading ? "Sending..." : "Request Demo"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-center gap-3">
                <span className="text-[11px] text-[var(--foreground-subtle)]">Or reach us directly</span>
                <a
                  href="https://wa.me/971XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#25d366] hover:opacity-80 transition-opacity"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  WhatsApp us
                </a>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
