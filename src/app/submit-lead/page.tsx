"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2, Loader2, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ChatWidget from "@/components/chat/ChatWidget";

export default function SubmitLeadPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    raw_message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.raw_message.trim()) {
      setError("Name, phone, and your requirement are required.");
      return;
    }

    const orgId = process.env.NEXT_PUBLIC_ORG_ID;
    if (!orgId) {
      setError("Configuration error. Please contact the agency.");
      return;
    }

    setLoading(true);
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    const endpoint = n8nUrl || "/api/lead-webhook";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        source: "web_form",
        organization_id: orgId,
        webhook_secret: "estateflow-secret-2024",
      }),
    });

    let data: Record<string, unknown> = {};
    try { data = await res.json(); } catch { /* n8n may return empty body */ }
    if (!res.ok && data.error) {
      setError(String(data.error));
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 page-glow">
      <ChatWidget />
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--accent-muted)] border border-[var(--border-accent)] rounded-2xl mb-4">
            <Building2 size={22} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Share Your Requirement</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1.5">
            Tell us what you&apos;re looking for and we&apos;ll get back to you shortly.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated p-10 text-center flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[var(--success)]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  Requirement Received!
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  Our team will review your requirement and reach out soon.
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ name: "", phone: "", email: "", raw_message: "" });
                }}
                className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors mt-2"
              >
                Submit another requirement
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="card-elevated p-6 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Rahul Sharma"
                  required
                />
                <Input
                  label="Phone *"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <Input
                label="Email (optional)"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="rahul@email.com"
              />

              <Textarea
                label="Your Requirement *"
                value={form.raw_message}
                onChange={set("raw_message")}
                rows={4}
                placeholder="E.g. Looking for a 3BHK apartment in Chennai under ₹90 lakhs..."
                required
                hint="Be as specific as possible — location, budget, property type, timeline."
              />

              {error && (
                <p className="text-sm text-[var(--danger)] bg-[var(--danger-muted)] px-3 py-2 rounded-xl border border-[rgba(239,68,68,0.2)]">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Send size={15} /> Submit Requirement
                  </>
                )}
              </Button>

              <p className="text-[11px] text-[var(--foreground-subtle)] text-center">
                Your information is kept confidential and only used to match properties.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
