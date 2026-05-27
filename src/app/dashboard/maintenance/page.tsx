"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench, Plus, Loader2, Pencil, Trash2, Search,
  AlertCircle, Clock, CheckCircle2, XCircle
} from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import MaintenanceTicketModal from "@/components/tenants/MaintenanceTicketModal";
import { useMaintenance } from "@/lib/hooks/useMaintenance";
import type { MaintenanceTicket, TicketStatus } from "@/types";

const priorityVariant: Record<string, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

const statusVariant: Record<string, "warning" | "default" | "success"> = {
  open: "warning", in_progress: "warning", resolved: "success", closed: "default",
};

const categoryIcons: Record<string, string> = {
  plumbing: "🔧", electrical: "⚡", carpentry: "🪚", cleaning: "🧹", security: "🔒", general: "📋",
};

const categoryColors: Record<string, string> = {
  plumbing: "#3b82f6", electrical: "#eab308", carpentry: "#d97706",
  cleaning: "#14b8a6", security: "#ef4444", general: "#6b7280",
};

const priorityBorderColor: Record<string, string> = {
  high: "#ef4444", medium: "#f59e0b", low: "#6b7280",
};

const STATUS_OPTIONS: { label: string; value: TicketStatus | "" }[] = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const PRIORITY_OPTIONS = [
  { label: "All Priority", value: "" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const CATEGORY_OPTIONS = [
  { label: "All Category", value: "" },
  { label: "General", value: "general" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "Carpentry", value: "carpentry" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Security", value: "security" },
];

export default function MaintenancePage() {
  const { tickets, loading, fetchTickets, addTicket, updateTicket, deleteTicket } = useMaintenance();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MaintenanceTicket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceTicket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = tickets.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    high: tickets.filter((t) => t.priority === "high").length,
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteTicket(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  async function quickStatusUpdate(ticket: MaintenanceTicket, status: TicketStatus) {
    await updateTicket(ticket.id, {
      status,
      resolved_at: status === "resolved" ? new Date().toISOString() : undefined,
    });
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Maintenance" subtitle="Track and manage maintenance tickets" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Open", value: stats.open, icon: AlertCircle, color: "var(--warning)" },
            { label: "In Progress", value: stats.in_progress, icon: Clock, color: "var(--accent)" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "var(--success)" },
            { label: "High Priority", value: stats.high, icon: XCircle, color: "var(--danger)" },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--foreground)]">{value}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets…"
              className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {[
            { value: statusFilter, onChange: (v: string) => setStatusFilter(v as TicketStatus | ""), options: STATUS_OPTIONS },
            { value: priorityFilter, onChange: setPriorityFilter, options: PRIORITY_OPTIONS },
            { value: categoryFilter, onChange: setCategoryFilter, options: CATEGORY_OPTIONS },
          ].map(({ value, onChange, options }, i) => (
            <select
              key={i}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            >
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}

          <Button size="sm" onClick={() => { setEditTarget(null); setFormOpen(true); }}>
            <Plus size={14} /> New Ticket
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Wrench size={40} className="text-[var(--foreground-subtle)] mx-auto mb-3" />
            <p className="text-[var(--foreground-muted)] mb-4">
              {search || statusFilter || priorityFilter || categoryFilter
                ? "No tickets match your filters."
                : "No maintenance tickets yet."}
            </p>
            {!search && !statusFilter && !priorityFilter && !categoryFilter && (
              <Button size="sm" onClick={() => setFormOpen(true)}><Plus size={14} /> New Ticket</Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-colors group"
                style={{ borderLeft: `3px solid ${priorityBorderColor[ticket.priority] ?? "#6b7280"}` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{
                      background: `${categoryColors[ticket.category] ?? "#6b7280"}18`,
                      border: `1px solid ${categoryColors[ticket.category] ?? "#6b7280"}30`,
                    }}
                  >
                    {categoryIcons[ticket.category] ?? "📋"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{ticket.title}</p>
                      <Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge>
                      <Badge variant={statusVariant[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                    </div>
                    {ticket.description && (
                      <p className="text-xs text-[var(--foreground-muted)] mb-2 line-clamp-2">{ticket.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)]">
                      <span className="capitalize">{ticket.category}</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      {ticket.resolved_at && (
                        <span className="text-[var(--success)]">Resolved {new Date(ticket.resolved_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {ticket.status === "open" && (
                      <Button variant="secondary" size="sm" onClick={() => quickStatusUpdate(ticket, "in_progress")}>
                        Start
                      </Button>
                    )}
                    {ticket.status === "in_progress" && (
                      <Button size="sm" onClick={() => quickStatusUpdate(ticket, "resolved")}>
                        <CheckCircle2 size={12} /> Resolve
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => { setEditTarget(ticket); setFormOpen(true); }}>
                      <Pencil size={12} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(ticket)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <MaintenanceTicketModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSubmit={editTarget ? (d) => updateTicket(editTarget.id, d) : addTicket}
        initial={editTarget}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Ticket"
        message={`Delete ticket "${deleteTarget?.title}"?`}
        confirmLabel="Delete Ticket"
      />
    </div>
  );
}
