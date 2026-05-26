"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Brain, Phone, LayoutList,
  Kanban, Filter, Trash2, Pencil, Eye,
  MapPin, Clock, Users,
} from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LeadFormModal from "@/components/leads/LeadFormModal";
import KanbanBoard from "@/components/leads/KanbanBoard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Select from "@/components/ui/Select";
import { useLeads, defaultLeadFilters, type LeadFilters } from "@/lib/hooks/useLeads";
import type { Lead, LeadStage, LeadUrgency } from "@/types";
import { cn } from "@/lib/utils";

const urgencyVariant: Record<LeadUrgency, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

const stageLabel: Record<LeadStage, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  site_visit: "Site Visit", negotiation: "Negotiation", closed: "Closed", lost: "Lost",
};

const stageColor: Record<LeadStage, string> = {
  new: "var(--accent)", contacted: "#818cf8", qualified: "#a78bfa",
  site_visit: "var(--warning)", negotiation: "#fb923c",
  closed: "var(--success)", lost: "var(--danger)",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const stageOptions = [
  { label: "All Stages", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Closed", value: "closed" },
  { label: "Lost", value: "lost" },
];

const urgencyOptions = [
  { label: "All Urgency", value: "" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

type ViewMode = "table" | "kanban";

export default function LeadsPage() {
  const { leads, loading, addLead, updateLead, deleteLead, fetchLeads } = useLeads();

  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<LeadFilters>(defaultLeadFilters);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const applyFilters = useCallback(() => {
    fetchLeads({ ...filters, search });
  }, [filters, search, fetchLeads]);

  function openAdd() { setEditTarget(null); setFormOpen(true); }
  function openEdit(l: Lead) { setEditTarget(l); setFormOpen(true); }

  async function handleFormSubmit(data: Omit<Lead, "id" | "created_at" | "ai_analyzed">) {
    if (editTarget) return await updateLead(editTarget.id, data);
    return await addLead(data);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteLead(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  async function handleStageChange(id: string, stage: LeadStage) {
    await updateLead(id, { status: stage });
  }

  const displayed = search
    ? leads.filter((l) =>
        (l.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (l.phone ?? "").includes(search) ||
        (l.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (l.raw_message ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : leads;

  const hasFilters = filters.stage || filters.urgency;

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Leads" subtitle={`${leads.length} total lead${leads.length !== 1 ? "s" : ""}`} />

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
            <Search size={14} className="text-[var(--foreground-muted)] shrink-0" />
            <input
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none flex-1"
            />
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2">
            <Select
              value={filters.stage}
              onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value as LeadStage | "" }))}
              options={stageOptions}
              className="text-xs py-1.5 w-36"
            />
            <Select
              value={filters.urgency}
              onChange={(e) => setFilters((f) => ({ ...f, urgency: e.target.value as LeadUrgency | "" }))}
              options={urgencyOptions}
              className="text-xs py-1.5 w-32"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => { setFilters(defaultLeadFilters); fetchLeads(); }}>
                <Filter size={13} /> Clear
              </Button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-0.5">
              {([["table", LayoutList], ["kanban", Kanban]] as [ViewMode, React.ElementType][]).map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    view === v
                      ? "bg-[var(--surface-3)] text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>

            <Button size="sm" onClick={openAdd}>
              <Plus size={14} /> Add Lead
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-0 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0">
                <div className="w-32 h-4 bg-[var(--surface-3)] rounded" />
                <div className="flex-1 h-3 bg-[var(--surface-3)] rounded" />
                <div className="w-16 h-5 bg-[var(--surface-3)] rounded-full" />
                <div className="w-20 h-5 bg-[var(--surface-3)] rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <div className="p-4 bg-[var(--surface-2)] rounded-2xl">
              <Users size={32} className="text-[var(--foreground-subtle)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">No leads found</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                {hasFilters || search ? "Try adjusting your filters." : "Add your first lead to get started."}
              </p>
            </div>
            {!hasFilters && !search && (
              <Button size="sm" onClick={openAdd}><Plus size={14} /> Add Lead</Button>
            )}
          </motion.div>
        )}

        {/* TABLE VIEW */}
        {!loading && displayed.length > 0 && view === "table" && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_2fr_auto_auto_auto_auto] gap-3 px-5 py-3 border-b border-[var(--border)] text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              <span>Lead</span>
              <span>Requirement</span>
              <span>Urgency</span>
              <span>Stage</span>
              <span>Time</span>
              <span />
            </div>

            <AnimatePresence>
              <div className="divide-y divide-[var(--border)]">
                {displayed.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-[1.5fr_2fr_auto_auto_auto_auto] gap-3 items-center px-5 py-3.5 hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    {/* Lead info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${stageColor[lead.status as LeadStage]}cc, ${stageColor[lead.status as LeadStage]}44)` }}
                      >
                        {(lead.name ?? "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/dashboard/leads/${lead.id}`} className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors block truncate">
                          {lead.name ?? "Unknown"}
                        </Link>
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] mt-0.5">
                            <Phone size={10} />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirement */}
                    <div>
                      <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">
                        {lead.summary || lead.raw_message || "—"}
                      </p>
                      {(lead.budget || lead.location) && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Brain size={9} className="text-[var(--accent)]" />
                          <span className="text-xs text-[var(--accent)]">
                            {[lead.budget, lead.location].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Urgency */}
                    <Badge variant={urgencyVariant[lead.urgency as LeadUrgency ?? "medium"]}>
                      {lead.urgency ?? "medium"}
                    </Badge>

                    {/* Stage pill */}
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: `${stageColor[lead.status as LeadStage]}15`,
                        color: stageColor[lead.status as LeadStage],
                      }}
                    >
                      {stageLabel[lead.status as LeadStage]}
                    </span>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-[var(--foreground-subtle)] whitespace-nowrap">
                      <Clock size={10} />
                      {timeAgo(lead.created_at)}
                    </div>

                    {/* Row actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <button className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors">
                          <Eye size={13} />
                        </button>
                      </Link>
                      <button
                        onClick={() => openEdit(lead)}
                        className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}

        {/* KANBAN VIEW */}
        {!loading && displayed.length > 0 && view === "kanban" && (
          <KanbanBoard leads={displayed} onStageChange={handleStageChange} />
        )}
      </div>

      {/* Modals */}
      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initial={editTarget}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Lead"
        message={`Delete lead "${deleteTarget?.name}"? All associated conversations will also be removed.`}
        confirmLabel="Delete Lead"
      />
    </div>
  );
}
