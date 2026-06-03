"use client";

import { motion } from "framer-motion";
import { Brain, Phone, MapPin, ChevronRight, Crown } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Lead, LeadStage, LeadUrgency } from "@/types";

const STAGES: { key: LeadStage; label: string; color: string }[] = [
  { key: "new",         label: "New",         color: "var(--accent)" },
  { key: "contacted",   label: "Contacted",   color: "#818cf8" },
  { key: "qualified",   label: "Qualified",   color: "#a78bfa" },
  { key: "site_visit",  label: "Site Visit",  color: "var(--warning)" },
  { key: "negotiation", label: "Negotiation", color: "#fb923c" },
  { key: "closed",      label: "Closed",      color: "var(--success)" },
  { key: "lost",        label: "Lost",        color: "var(--danger)" },
];

const urgencyVariant: Record<LeadUrgency, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

interface KanbanBoardProps {
  leads: Lead[];
  onStageChange: (id: string, stage: LeadStage) => void;
}

export default function KanbanBoard({ leads, onStageChange }: KanbanBoardProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[60vh]">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.key);
        return (
          <div key={stage.key} className="flex flex-col gap-2 min-w-[240px] w-[240px] shrink-0">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                <span className="text-xs font-semibold text-[var(--foreground)]">{stage.label}</span>
              </div>
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${stage.color}20`, color: stage.color }}
              >
                {stageLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {stageLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 hover:border-[var(--border-strong)] transition-colors cursor-pointer group"
                >
                  <Link href={`/dashboard/leads/${lead.id}`} className="block">
                    {/* Name + urgency */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">{lead.name ?? "Unknown"}</p>
                      {lead.urgency && (
                        <Badge variant={urgencyVariant[lead.urgency as LeadUrgency]} className="shrink-0 text-[10px]">
                          {lead.urgency}
                        </Badge>
                      )}
                    </div>

                    {/* Golden Visa flag (AED 2M+ buyers) */}
                    {lead.golden_visa && (
                      <div
                        className="inline-flex items-center gap-1 mb-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: "rgba(212,175,55,0.14)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.35)" }}
                      >
                        <Crown size={9} />
                        Golden Visa
                      </div>
                    )}

                    {/* Requirement summary */}
                    {(lead.summary || lead.raw_message) && (
                      <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 mb-2 leading-relaxed">
                        {lead.summary || lead.raw_message}
                      </p>
                    )}

                    {/* AI extracted */}
                    {(lead.budget || lead.location) && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain size={9} className="text-[var(--accent)] shrink-0" />
                        <span className="text-[10px] text-[var(--accent)] truncate">
                          {[lead.budget, lead.location].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    )}

                    {/* Phone */}
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--foreground-subtle)]">
                        <Phone size={9} />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.location && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--foreground-subtle)] mt-0.5">
                        <MapPin size={9} />
                        <span>{lead.location}</span>
                      </div>
                    )}
                  </Link>

                  {/* Quick move */}
                  <div className="mt-3 pt-2 border-t border-[var(--border)] hidden group-hover:flex items-center justify-between gap-1">
                    <span className="text-[10px] text-[var(--foreground-subtle)]">Move to</span>
                    <div className="flex gap-1">
                      {STAGES.filter((s) => s.key !== stage.key).slice(0, 2).map((s) => (
                        <button
                          key={s.key}
                          onClick={(e) => { e.preventDefault(); onStageChange(lead.id, s.key); }}
                          className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
                        >
                          {s.label} <ChevronRight size={8} />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {stageLeads.length === 0 && (
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center">
                  <p className="text-xs text-[var(--foreground-subtle)]">No leads</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
