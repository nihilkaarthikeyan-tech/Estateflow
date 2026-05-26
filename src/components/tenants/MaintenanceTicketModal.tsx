"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { MaintenanceTicket, TicketCategory, TicketPriority } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MaintenanceTicket, "id" | "created_at" | "updated_at">) => Promise<{ error?: string }>;
  initial?: MaintenanceTicket | null;
  tenantId?: string;
  propertyId?: string;
}

const categoryOptions = [
  { label: "General", value: "general" }, { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" }, { label: "Carpentry", value: "carpentry" },
  { label: "Cleaning", value: "cleaning" }, { label: "Security", value: "security" },
];

const priorityOptions = [
  { label: "High", value: "high" }, { label: "Medium", value: "medium" }, { label: "Low", value: "low" },
];

const statusOptions = [
  { label: "Open", value: "open" }, { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" }, { label: "Closed", value: "closed" },
];

const blank = {
  title: "", description: "", category: "general" as TicketCategory,
  priority: "medium" as TicketPriority, status: "open" as MaintenanceTicket["status"],
  tenant_id: undefined as string | undefined, property_id: undefined as string | undefined,
  assigned_to: undefined as string | undefined, resolved_at: undefined as string | undefined,
};

export default function MaintenanceTicketModal({ open, onClose, onSubmit, initial, tenantId, propertyId }: Props) {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? {
      title: initial.title, description: initial.description ?? "",
      category: initial.category, priority: initial.priority, status: initial.status,
      tenant_id: initial.tenant_id, property_id: initial.property_id,
      assigned_to: initial.assigned_to, resolved_at: initial.resolved_at,
    } : { ...blank, tenant_id: tenantId, property_id: propertyId });
    setError("");
  }, [initial, open, tenantId, propertyId]);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) { setError("Title is required."); return; }
    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);
    if (result.error) setError(result.error);
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Ticket" : "New Maintenance Ticket"} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Issue Title" placeholder="Water leak in bathroom" value={form.title} onChange={set("title")} required />
        <textarea
          rows={3}
          placeholder="Describe the issue in detail…"
          value={form.description}
          onChange={set("description")}
          className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
        <div className="grid grid-cols-3 gap-3">
          <Select label="Category" value={form.category} onChange={set("category")} options={categoryOptions} />
          <Select label="Priority" value={form.priority} onChange={set("priority")} options={priorityOptions} />
          <Select label="Status" value={form.status} onChange={set("status")} options={statusOptions} />
        </div>
        {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : initial ? "Save Changes" : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
