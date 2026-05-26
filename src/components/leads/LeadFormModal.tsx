"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Lead, LeadStage, LeadUrgency, BuyerIntent } from "@/types";

type LeadPayload = Omit<Lead, "id" | "created_at" | "ai_analyzed">;

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadPayload) => Promise<{ error?: string }>;
  initial?: Lead | null;
}

const urgencyOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const intentOptions = [
  { label: "Serious Buyer", value: "serious" },
  { label: "Researching", value: "researching" },
  { label: "Comparing Options", value: "comparing" },
];

const stageOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Closed", value: "closed" },
  { label: "Lost", value: "lost" },
];

const sourceOptions = [
  { label: "Web Form", value: "web_form" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Referral", value: "referral" },
  { label: "Manual", value: "manual" },
];

const blank: LeadPayload = {
  name: "", phone: "", email: "",
  raw_message: "", budget: "", location: "",
  property_type: "", summary: "", notes: "",
  urgency: "medium", buyer_intent: "researching",
  status: "new", source: "manual", assigned_to: "",
};

export default function LeadFormModal({ open, onClose, onSubmit, initial }: LeadFormModalProps) {
  const [form, setForm] = useState<LeadPayload>(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? {
      name: initial.name ?? "",
      phone: initial.phone ?? "",
      email: initial.email ?? "",
      raw_message: initial.raw_message ?? "",
      budget: initial.budget ?? "",
      location: initial.location ?? "",
      property_type: initial.property_type ?? "",
      summary: initial.summary ?? "",
      notes: initial.notes ?? "",
      urgency: initial.urgency ?? "medium",
      buyer_intent: initial.buyer_intent ?? "researching",
      status: initial.status ?? "new",
      source: initial.source ?? "manual",
      assigned_to: initial.assigned_to ?? "",
    } : blank);
    setError("");
  }, [initial, open]);

  const set = (field: keyof LeadPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone) { setError("Name and phone are required."); return; }
    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Lead" : "Add New Lead"} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Contact */}
        <section>
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Contact Info</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={set("name")} required />
            <Input label="Phone" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required />
            <div className="md:col-span-2">
              <Input label="Email (optional)" type="email" placeholder="rahul@email.com" value={form.email} onChange={set("email")} />
            </div>
          </div>
        </section>

        {/* Requirement */}
        <section>
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Requirement</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">Raw Message / Requirement</label>
              <textarea
                rows={3}
                placeholder="Need a 3BHK apartment in Chennai under 90 lakhs near metro station."
                value={form.raw_message}
                onChange={set("raw_message")}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Budget" placeholder="₹90L" value={form.budget} onChange={set("budget")} />
              <Input label="Preferred Location" placeholder="Chennai" value={form.location} onChange={set("location")} />
            </div>
            <Input label="Property Type" placeholder="3BHK Apartment" value={form.property_type} onChange={set("property_type")} />
          </div>
        </section>

        {/* Intelligence */}
        <section>
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Lead Intelligence</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Select label="Urgency" value={form.urgency} onChange={set("urgency")} options={urgencyOptions} />
            <Select label="Buyer Intent" value={form.buyer_intent} onChange={set("buyer_intent")} options={intentOptions} />
            <Select label="Source" value={form.source ?? "manual"} onChange={set("source")} options={sourceOptions} />
          </div>
        </section>

        {/* CRM */}
        <section>
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">CRM</p>
          <div className="grid grid-cols-1 gap-4">
            <Select label="Pipeline Stage" value={form.status} onChange={set("status")} options={stageOptions} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground-muted)]">Internal Notes</label>
              <textarea
                rows={2}
                placeholder="Add notes for your team…"
                value={form.notes ?? ""}
                onChange={set("notes")}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : initial ? "Save Changes" : "Add Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
