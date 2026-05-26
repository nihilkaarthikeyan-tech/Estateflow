"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Lease } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Lease, "id" | "created_at">) => Promise<{ error?: string }>;
  initial?: Lease | null;
  tenantId?: string;
  propertyId?: string;
}

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Terminated", value: "terminated" },
];

const blank = {
  tenant_id: undefined as string | undefined,
  property_id: undefined as string | undefined,
  start_date: "",
  end_date: "",
  monthly_rent: 0,
  deposit: 0,
  status: "active" as Lease["status"],
};

export default function LeaseFormModal({ open, onClose, onSubmit, initial, tenantId, propertyId }: Props) {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? {
      tenant_id: initial.tenant_id,
      property_id: initial.property_id,
      start_date: initial.start_date,
      end_date: initial.end_date,
      monthly_rent: initial.monthly_rent,
      deposit: initial.deposit ?? 0,
      status: initial.status,
    } : { ...blank, tenant_id: tenantId, property_id: propertyId });
    setError("");
  }, [initial, open, tenantId, propertyId]);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const setNum = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: parseFloat(e.target.value) || 0 }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.start_date || !form.end_date) { setError("Start and end dates are required."); return; }
    if (!form.monthly_rent) { setError("Monthly rent is required."); return; }
    if (!form.tenant_id) { setError("Tenant ID is missing."); return; }
    setLoading(true);
    const result = await onSubmit({ ...form, tenant_id: form.tenant_id });
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Lease" : "Add Lease"} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--foreground-muted)]">Start Date</label>
            <input
              type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} required
              className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--foreground-muted)]">End Date</label>
            <input
              type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} required
              className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Monthly Rent (₹)" type="number" placeholder="25000" value={String(form.monthly_rent)} onChange={setNum("monthly_rent")} required />
          <Input label="Security Deposit (₹)" type="number" placeholder="50000" value={String(form.deposit)} onChange={setNum("deposit")} />
        </div>
        <Select label="Status" value={form.status} onChange={set("status")} options={statusOptions} />
        {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : initial ? "Save Changes" : "Add Lease"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
