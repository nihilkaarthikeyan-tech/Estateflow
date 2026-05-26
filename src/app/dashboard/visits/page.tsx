"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck, Plus, Search, Phone, Mail, Home,
  CheckCircle2, XCircle, Clock, Eye, Loader2, MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Visit {
  id: string;
  property_id: string | null;
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string | null;
  visit_date: string;
  visit_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  created_at: string;
  properties?: { title: string; location: string; city: string | null } | null;
}

const statusVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
  scheduled: "warning",
  completed: "success",
  cancelled: "default",
  no_show: "danger",
};

const statusOptions = [
  { label: "All", value: "" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no_show" },
];

const timeSlots = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ visitor_name: "", visitor_phone: "", visitor_email: "", visit_date: "", visit_time: "10:00", notes: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const loadVisits = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("visits")
      .select("*, properties(title, location, city)")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true });
    setVisits((data ?? []) as Visit[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadVisits(); }, [loadVisits]);

  async function updateStatus(id: string, status: Visit["status"]) {
    const supabase = createClient();
    await supabase.from("visits").update({ status }).eq("id", id);
    setVisits((v) => v.map((x) => x.id === id ? { ...x, status } : x));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.visitor_name || !form.visitor_phone || !form.visit_date) {
      setFormError("Name, phone and date are required."); return;
    }
    setFormLoading(true);
    setFormError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user?.id ?? "").single();
    const { error } = await supabase.from("visits").insert({
      organization_id: profile?.organization_id,
      visitor_name: form.visitor_name,
      visitor_phone: form.visitor_phone,
      visitor_email: form.visitor_email || null,
      visit_date: form.visit_date,
      visit_time: form.visit_time,
      notes: form.notes || null,
      status: "scheduled",
    });
    setFormLoading(false);
    if (error) { setFormError(error.message); return; }
    setFormOpen(false);
    setForm({ visitor_name: "", visitor_phone: "", visitor_email: "", visit_date: "", visit_time: "10:00", notes: "" });
    loadVisits();
  }

  const filtered = visits.filter((v) => {
    if (statusFilter && v.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return v.visitor_name.toLowerCase().includes(q) ||
        v.visitor_phone.includes(q) ||
        (v.properties?.title ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: visits.length,
    scheduled: visits.filter((v) => v.status === "scheduled").length,
    completed: visits.filter((v) => v.status === "completed").length,
    today: visits.filter((v) => v.visit_date === new Date().toISOString().split("T")[0]).length,
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Site Visits" subtitle="Schedule and track property visits" />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=60"
            alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.18]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: "var(--accent)" }}>Visit Management</p>
              <p className="text-lg font-bold text-[var(--foreground)]">Site Visits</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Track all scheduled and completed property visits</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
                <span className="text-xs font-semibold text-[var(--warning)]">{stats.today} today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Visits", value: stats.total, icon: CalendarCheck, color: "var(--accent)" },
            { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "var(--warning)" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "var(--success)" },
            { label: "Today", value: stats.today, icon: Eye, color: "#8b5cf6" },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
            <Search size={14} className="text-[var(--foreground-muted)] shrink-0" />
            <input placeholder="Search visits…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none flex-1" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors">
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button size="sm" onClick={() => setFormOpen(true)} className="ml-auto">
            <Plus size={14} /> Add Visit
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <CalendarCheck size={40} className="text-[var(--foreground-subtle)] mx-auto mb-3" />
            <p className="text-[var(--foreground-muted)] mb-4">
              {search || statusFilter ? "No visits match your filters." : "No visits scheduled yet."}
            </p>
            {!search && !statusFilter && (
              <Button size="sm" onClick={() => setFormOpen(true)}><Plus size={14} /> Schedule Visit</Button>
            )}
          </div>
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border)] text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              <span>Visitor</span>
              <span>Property</span>
              <span>Date & Time</span>
              <span>Status</span>
              <span />
            </div>
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((visit, i) => (
                <motion.div key={visit.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_1fr_auto_auto] gap-3 md:gap-4 items-center px-5 py-4 hover:bg-[var(--surface-2)] transition-colors group">
                  {/* Visitor */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--accent)cc, var(--accent)44)" }}>
                      {visit.visitor_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{visit.visitor_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {visit.visitor_phone && <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]"><Phone size={9} />{visit.visitor_phone}</span>}
                        {visit.visitor_email && <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]"><Mail size={9} />{visit.visitor_email}</span>}
                      </div>
                    </div>
                  </div>
                  {/* Property */}
                  <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                    {visit.properties ? (
                      <>
                        <Home size={12} className="text-[var(--accent)] shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-[var(--foreground)] truncate max-w-[160px]">{visit.properties.title}</p>
                          <p className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]">
                            <MapPin size={8} />{visit.properties.location}{visit.properties.city ? `, ${visit.properties.city}` : ""}
                          </p>
                        </div>
                      </>
                    ) : <span className="text-xs text-[var(--foreground-subtle)]">—</span>}
                  </div>
                  {/* Date */}
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {new Date(visit.visit_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {visit.visit_time}
                    </p>
                  </div>
                  {/* Status */}
                  <Badge variant={statusVariant[visit.status]}>{visit.status.replace("_", " ")}</Badge>
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {visit.status === "scheduled" && (
                      <button onClick={() => updateStatus(visit.id, "completed")}
                        className="p-1.5 rounded-lg text-[var(--success)] hover:bg-[var(--success)]/10 transition-colors" title="Mark completed">
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    {visit.status === "scheduled" && (
                      <button onClick={() => updateStatus(visit.id, "cancelled")}
                        className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors" title="Cancel">
                        <XCircle size={14} />
                      </button>
                    )}
                    {visit.status === "scheduled" && (
                      <button onClick={() => updateStatus(visit.id, "no_show")}
                        className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--surface-3)] transition-colors text-xs font-medium px-2" title="No show">
                        NS
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Visit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[var(--foreground)]">Schedule Visit</h2>
              <button onClick={() => setFormOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--surface-2)]">✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              {[
                { label: "Visitor Name *", key: "visitor_name", type: "text", placeholder: "Rahul Sharma" },
                { label: "Phone *", key: "visitor_phone", type: "tel", placeholder: "+91 98765 43210" },
                { label: "Email", key: "visitor_email", type: "email", placeholder: "rahul@email.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Date *</label>
                  <input type="date" min={new Date().toISOString().split("T")[0]} value={form.visit_date}
                    onChange={(e) => setForm((f) => ({ ...f, visit_date: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Time *</label>
                  <select value={form.visit_time} onChange={(e) => setForm((f) => ({ ...f, visit_time: e.target.value }))}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors">
                    {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Notes</label>
                <textarea rows={2} placeholder="Any special instructions…" value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none" />
              </div>
              {formError && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">{formError}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setFormOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}>
                  {formLoading ? <Loader2 size={14} className="animate-spin" /> : <CalendarCheck size={14} />}
                  Schedule Visit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
