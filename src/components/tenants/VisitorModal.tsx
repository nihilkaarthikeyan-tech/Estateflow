"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Visitor } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Visitor, "id" | "created_at">) => Promise<{ error?: string }>;
  initial?: Visitor | null;
  tenantId?: string;
}

const blank = {
  visitor_name: "", visitor_phone: "", purpose: "",
  visit_date: "", status: "pending" as Visitor["status"],
  tenant_id: undefined as string | undefined,
};

export default function VisitorModal({ open, onClose, onSubmit, initial, tenantId }: Props) {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? {
      visitor_name: initial.visitor_name, visitor_phone: initial.visitor_phone ?? "",
      purpose: initial.purpose ?? "",
      visit_date: initial.visit_date ? new Date(initial.visit_date).toISOString().slice(0, 16) : "",
      status: initial.status, tenant_id: initial.tenant_id,
    } : { ...blank, tenant_id: tenantId });
    setError("");
  }, [initial, open, tenantId]);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.visitor_name) { setError("Visitor name is required."); return; }
    setLoading(true);
    const result = await onSubmit({
      ...form,
      visit_date: form.visit_date ? new Date(form.visit_date).toISOString() : undefined,
    });
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Visitor" : "Add Visitor Request"} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Visitor Name" placeholder="John Doe" value={form.visitor_name} onChange={set("visitor_name")} required />
          <Input label="Phone" placeholder="+91 98765 43210" value={form.visitor_phone} onChange={set("visitor_phone")} />
        </div>
        <Input label="Purpose of Visit" placeholder="Family visit, delivery, etc." value={form.purpose} onChange={set("purpose")} />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--foreground-muted)]">Visit Date & Time</label>
          <input
            type="datetime-local"
            value={form.visit_date}
            onChange={(e) => setForm((p) => ({ ...p, visit_date: e.target.value }))}
            className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
