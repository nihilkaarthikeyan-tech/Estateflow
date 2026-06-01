"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Phone, Loader2, FileText, Wrench, CalendarCheck, CheckCircle2, Plus, Send } from "lucide-react";
import Link from "next/link";

interface TenantData {
  tenant: { id: string; name: string; email: string; phone: string; unit_number: string; status: string };
  lease: { start_date: string; end_date: string; monthly_rent: number; status: string } | null;
  tickets: { id: string; title: string; status: string; priority: string; created_at: string }[];
  property: { title: string; location: string; city: string } | null;
}

export default function TenantPortalPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TenantData | null>(null);
  const [tab, setTab] = useState<"overview" | "maintenance">("overview");
  const [ticketForm, setTicketForm] = useState({ title: "", description: "", category: "general" });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError("");
    const res = await fetch(`/api/tenant-portal/lookup?phone=${encodeURIComponent(phone.trim())}`);
    const json = await res.json();
    setLoading(false);
    if (!res.ok || json.error) { setError(json.error ?? "Tenant not found. Please check your phone number."); return; }
    setData(json);
  }

  async function handleTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketForm.title || !data) return;
    setTicketLoading(true);
    const res = await fetch("/api/tenant-portal/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ticketForm, tenant_id: data.tenant.id }),
    });
    setTicketLoading(false);
    if (res.ok) {
      setTicketSuccess(true);
      setTicketForm({ title: "", description: "", category: "general" });
      setTimeout(() => setTicketSuccess(false), 3000);
      const json = await fetch(`/api/tenant-portal/lookup?phone=${encodeURIComponent(phone)}`).then(r => r.json());
      if (!json.error) setData(json);
    }
  }

  const daysLeft = data?.lease?.end_date
    ? Math.ceil((new Date(data.lease.end_date).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=1920&q=60"
        alt="" className="fixed inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none" />

      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm sticky top-0">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">Estate<span className="gradient-text">Flow</span></span>
          </Link>
          <span className="text-xs text-[var(--foreground-muted)]">Tenant Portal</span>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "0 8px 24px var(--accent-glow)" }}>
                  <Building2 size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Tenant Portal</h1>
                <p className="text-sm text-[var(--foreground-muted)]">Enter your registered phone number to access your portal.</p>
              </div>
              <form onSubmit={handleLookup} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4 max-w-sm mx-auto">
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">
                    <Phone size={11} className="inline mr-1" />Your Phone Number
                  </label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 123 4567" required
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
                {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Phone size={15} />}
                  {loading ? "Looking up…" : "Access My Portal"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="portal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              {/* Profile card */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                      {data.tenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--foreground)]">{data.tenant.name}</p>
                      {data.tenant.unit_number && <p className="text-xs text-[var(--foreground-muted)]">Unit {data.tenant.unit_number}</p>}
                      {data.property && <p className="text-xs text-[var(--foreground-muted)]">{data.property.title}</p>}
                    </div>
                  </div>
                  <button onClick={() => setData(null)} className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Sign out</button>
                </div>
              </div>

              {/* Lease summary */}
              {data.lease && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={15} className="text-[var(--accent)]" />
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">Active Lease</h2>
                    {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                      <span className="text-xs text-[var(--warning)] ml-auto">⚠ Expires in {daysLeft} days</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Monthly Rent", value: `AED ${data.lease.monthly_rent.toLocaleString("en-AE")}` },
                      { label: "Lease Start", value: new Date(data.lease.start_date).toLocaleDateString("en-AE") },
                      { label: "Lease End", value: new Date(data.lease.end_date).toLocaleDateString("en-AE") },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[var(--surface-2)] rounded-xl p-3">
                        <p className="text-xs text-[var(--foreground-subtle)] mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-[var(--foreground)]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
                {([
                  { key: "overview", label: "Maintenance Tickets", icon: Wrench },
                  { key: "maintenance", label: "Submit Request", icon: Plus },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-[var(--accent)] text-white" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              {/* Tickets list */}
              {tab === "overview" && (
                <div className="flex flex-col gap-3">
                  {data.tickets.length === 0 ? (
                    <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                      <CalendarCheck size={32} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                      <p className="text-sm text-[var(--foreground-muted)]">No maintenance requests yet.</p>
                    </div>
                  ) : data.tickets.map((t) => (
                    <div key={t.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-[var(--foreground)]">{t.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.status === "resolved" ? "bg-emerald-500/10 text-emerald-400" : t.status === "in_progress" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--warning)]/10 text-[var(--warning)]"}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)]">{new Date(t.created_at).toLocaleDateString("en-AE")}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit request */}
              {tab === "maintenance" && (
                <form onSubmit={handleTicketSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-4">
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">Submit Maintenance Request</h2>
                  {ticketSuccess && (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl text-sm">
                      <CheckCircle2 size={15} /> Request submitted successfully!
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Issue Title *</label>
                    <input value={ticketForm.title} onChange={(e) => setTicketForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Water leakage in bathroom" required
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Category</label>
                    <select value={ticketForm.category} onChange={(e) => setTicketForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors">
                      {["general","plumbing","electrical","carpentry","cleaning","security"].map(c => (
                        <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1.5">Description</label>
                    <textarea rows={3} value={ticketForm.description} onChange={(e) => setTicketForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the issue in detail…"
                      className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={ticketLoading || !ticketForm.title}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                    {ticketLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    Submit Request
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
