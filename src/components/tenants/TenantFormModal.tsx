"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Tenant, TenantStatus } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Tenant, "id" | "created_at">) => Promise<{ error?: string }>;
  initial?: Tenant | null;
  properties?: { id: string; title: string }[];
}

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
];

const blank = { name: "", phone: "", email: "", unit_number: "", property_id: "", status: "active" as TenantStatus };

export default function TenantFormModal({ open, onClose, onSubmit, initial, properties = [] }: Props) {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? {
      name: initial.name, phone: initial.phone ?? "", email: initial.email ?? "",
      unit_number: initial.unit_number ?? "", property_id: initial.property_id ?? "",
      status: initial.status,
    } : blank);
    setError("");
  }, [initial, open]);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError("Name is required."); return; }
    setLoading(true);
    const result = await onSubmit({ ...form, property_id: form.property_id || undefined });
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Tenant" : "Add Tenant"} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" placeholder="Ravi Kumar" value={form.name} onChange={set("name")} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
          <Input label="Email" type="email" placeholder="ravi@email.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Unit / Flat No." placeholder="A-204" value={form.unit_number} onChange={set("unit_number")} />
          <Select label="Status" value={form.status} onChange={set("status")} options={statusOptions} />
        </div>
        {properties.length > 0 && (
          <Select
            label="Property"
            value={form.property_id}
            onChange={set("property_id")}
            options={[{ label: "None", value: "" }, ...properties.map((p) => ({ label: p.title, value: p.id }))]}
          />
        )}
        {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : initial ? "Save Changes" : "Add Tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
