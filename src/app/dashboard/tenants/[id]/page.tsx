"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, Home, User, Plus, Pencil, Trash2, Loader2,
  Wrench, Users, CheckCircle2, XCircle, FileText, Calendar,
  AlertTriangle, Upload, Download, File,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import TenantFormModal from "@/components/tenants/TenantFormModal";
import LeaseFormModal from "@/components/tenants/LeaseFormModal";
import MaintenanceTicketModal from "@/components/tenants/MaintenanceTicketModal";
import VisitorModal from "@/components/tenants/VisitorModal";
import { useTenants } from "@/lib/hooks/useTenants";
import { useLeases } from "@/lib/hooks/useLeases";
import { useMaintenance } from "@/lib/hooks/useMaintenance";
import { useVisitors } from "@/lib/hooks/useVisitors";
import type { Tenant, Lease, MaintenanceTicket, Visitor } from "@/types";
import Link from "next/link";

const priorityVariant: Record<string, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

const ticketStatusVariant: Record<string, "warning" | "default" | "success"> = {
  open: "warning", in_progress: "warning", resolved: "success", closed: "default",
};

const visitorStatusVariant: Record<string, "warning" | "success" | "danger"> = {
  pending: "warning", approved: "success", rejected: "danger",
};

const leaseStatusVariant: Record<string, "success" | "default" | "danger"> = {
  active: "success", expired: "default", terminated: "danger",
};

type Tab = "lease" | "maintenance" | "visitors";

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { tenants, loading: tenantsLoading, updateTenant, deleteTenant } = useTenants();
  const { leases, loading: leasesLoading, addLease, updateLease, deleteLease } = useLeases(id);
  const { tickets, loading: ticketsLoading, addTicket, updateTicket, deleteTicket } = useMaintenance(id);
  const { visitors, loading: visitorsLoading, addVisitor, updateVisitor, deleteVisitor } = useVisitors(id);

  const [tab, setTab] = useState<Tab>("lease");
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);

  const [editTenantOpen, setEditTenantOpen] = useState(false);
  const [deleteTenantConfirm, setDeleteTenantConfirm] = useState(false);
  const [deleteTenantLoading, setDeleteTenantLoading] = useState(false);

  const [leaseFormOpen, setLeaseFormOpen] = useState(false);
  const [editLease, setEditLease] = useState<Lease | null>(null);
  const [deleteLeaseTarget, setDeleteLeaseTarget] = useState<Lease | null>(null);
  const [deleteLeaseLoading, setDeleteLeaseLoading] = useState(false);

  // Lease documents
  const [docs, setDocs] = useState<{ name: string; path: string; created_at: string }[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [ticketFormOpen, setTicketFormOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<MaintenanceTicket | null>(null);
  const [deleteTicketTarget, setDeleteTicketTarget] = useState<MaintenanceTicket | null>(null);
  const [deleteTicketLoading, setDeleteTicketLoading] = useState(false);

  const [visitorFormOpen, setVisitorFormOpen] = useState(false);
  const [editVisitor, setEditVisitor] = useState<Visitor | null>(null);
  const [deleteVisitorTarget, setDeleteVisitorTarget] = useState<Visitor | null>(null);
  const [deleteVisitorLoading, setDeleteVisitorLoading] = useState(false);

  useEffect(() => {
    createClient().from("properties").select("id, title")
      .then(({ data }) => setProperties((data ?? []) as { id: string; title: string }[]));
  }, []);

  async function fetchDocs() {
    setDocsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.storage.from("lease").list(id, { sortBy: { column: "created_at", order: "desc" } });
    setDocs((data ?? []).map((f) => ({ name: f.name, path: `${id}/${f.name}`, created_at: f.created_at ?? "" })));
    setDocsLoading(false);
  }

  useEffect(() => { if (tab === "lease") fetchDocs(); }, [tab, id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setUploadError("Max file size is 10 MB."); return; }
    setUploading(true);
    setUploadError("");
    const supabase = createClient();
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("lease").upload(`${id}/${filename}`, file);
    setUploading(false);
    if (error) { setUploadError(error.message); return; }
    fetchDocs();
    e.target.value = "";
  }

  async function handleDownload(path: string, name: string) {
    const supabase = createClient();
    const { data } = await supabase.storage.from("lease").createSignedUrl(path, 60);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = name;
      a.click();
    }
  }

  async function handleDeleteDoc(path: string) {
    const supabase = createClient();
    await supabase.storage.from("lease").remove([path]);
    setDocs((d) => d.filter((x) => x.path !== path));
  }

  const tenant = tenants.find((t) => t.id === id);

  if (!tenantsLoading && !tenant) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Tenant Not Found" />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-[var(--foreground-muted)]">This tenant does not exist or was deleted.</p>
          <Link href="/dashboard/tenants"><Button variant="secondary">Back to Tenants</Button></Link>
        </div>
      </div>
    );
  }

  const activeLease = leases.find((l) => l.status === "active") ?? leases[0];

  async function handleDeleteTenant() {
    setDeleteTenantLoading(true);
    await deleteTenant(id);
    setDeleteTenantLoading(false);
    router.push("/dashboard/tenants");
  }

  async function handleDeleteLease() {
    if (!deleteLeaseTarget) return;
    setDeleteLeaseLoading(true);
    await deleteLease(deleteLeaseTarget.id);
    setDeleteLeaseLoading(false);
    setDeleteLeaseTarget(null);
  }

  async function handleDeleteTicket() {
    if (!deleteTicketTarget) return;
    setDeleteTicketLoading(true);
    await deleteTicket(deleteTicketTarget.id);
    setDeleteTicketLoading(false);
    setDeleteTicketTarget(null);
  }

  async function handleDeleteVisitor() {
    if (!deleteVisitorTarget) return;
    setDeleteVisitorLoading(true);
    await deleteVisitor(deleteVisitorTarget.id);
    setDeleteVisitorLoading(false);
    setDeleteVisitorTarget(null);
  }

  const propertyTitle = tenant?.property_id
    ? (properties.find((p) => p.id === tenant.property_id)?.title ?? "Linked Property")
    : null;

  const daysUntilLeaseEnd = activeLease?.end_date
    ? Math.ceil((new Date(activeLease.end_date).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={tenantsLoading ? "Loading…" : (tenant?.name ?? "Tenant")}
        subtitle="Tenant Profile"
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/tenants">
              <Button variant="secondary" size="sm"><ArrowLeft size={14} /> Back</Button>
            </Link>
            {tenant && (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditTenantOpen(true)}><Pencil size={13} /> Edit</Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteTenantConfirm(true)}><Trash2 size={13} /></Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {tenantsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : tenant && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] font-bold text-2xl shrink-0">
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">{tenant.name}</h2>
                    <Badge variant={tenant.status === "active" ? "success" : tenant.status === "pending" ? "warning" : "default"}>
                      {tenant.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                    {tenant.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                        <Phone size={13} className="text-[var(--accent)]" /> {tenant.phone}
                      </span>
                    )}
                    {tenant.email && (
                      <span className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                        <Mail size={13} className="text-[var(--accent)]" /> {tenant.email}
                      </span>
                    )}
                    {tenant.unit_number && (
                      <span className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                        <User size={13} className="text-[var(--accent)]" /> Unit {tenant.unit_number}
                      </span>
                    )}
                    {propertyTitle && (
                      <span className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)]">
                        <Home size={13} className="text-[var(--accent)]" /> {propertyTitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lease expiry warning */}
                {daysUntilLeaseEnd !== null && daysUntilLeaseEnd <= 30 && daysUntilLeaseEnd >= 0 && (
                  <div className="flex items-center gap-2 bg-[var(--warning)]/10 text-[var(--warning)] text-xs px-3 py-2 rounded-lg">
                    <AlertTriangle size={13} /> Lease expires in {daysUntilLeaseEnd} day{daysUntilLeaseEnd !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
              {([
                { key: "lease", label: "Lease", icon: FileText },
                { key: "maintenance", label: "Maintenance", icon: Wrench },
                { key: "visitors", label: "Visitors", icon: Users },
              ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === key
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Lease Tab */}
            {tab === "lease" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Lease Records</h3>
                  <Button size="sm" onClick={() => { setEditLease(null); setLeaseFormOpen(true); }}>
                    <Plus size={13} /> Add Lease
                  </Button>
                </div>
                {leasesLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-[var(--accent)]" /></div>
                ) : leases.length === 0 ? (
                  <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                    <FileText size={32} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--foreground-muted)] mb-3">No lease records yet.</p>
                    <Button size="sm" onClick={() => setLeaseFormOpen(true)}><Plus size={13} /> Add Lease</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {leases.map((lease) => {
                      const days = Math.ceil((new Date(lease.end_date).getTime() - Date.now()) / 86400000);
                      return (
                        <div key={lease.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={leaseStatusVariant[lease.status]}>{lease.status}</Badge>
                              {lease.status === "active" && days <= 30 && days >= 0 && (
                                <span className="text-xs text-[var(--warning)]">Expires in {days}d</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" onClick={() => { setEditLease(lease); setLeaseFormOpen(true); }}><Pencil size={11} /></Button>
                              <Button variant="danger" size="sm" onClick={() => setDeleteLeaseTarget(lease)}><Trash2 size={11} /></Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: "Start Date", value: new Date(lease.start_date).toLocaleDateString() },
                              { label: "End Date", value: new Date(lease.end_date).toLocaleDateString() },
                              { label: "Monthly Rent", value: `₹${lease.monthly_rent.toLocaleString()}` },
                              { label: "Security Deposit", value: `₹${(lease.deposit ?? 0).toLocaleString()}` },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-xs text-[var(--foreground-subtle)] mb-0.5">{label}</p>
                                <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Lease Documents */}
            {tab === "lease" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-[var(--accent)]" />
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Lease Documents</h3>
                    <span className="text-xs text-[var(--foreground-subtle)]">PDF, DOC up to 10 MB</span>
                  </div>
                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "white" }}>
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {uploading ? "Uploading…" : "Upload"}
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>

                {uploadError && (
                  <p className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg mb-3">{uploadError}</p>
                )}

                {docsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 size={18} className="animate-spin text-[var(--accent)]" /></div>
                ) : docs.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-xl">
                    <File size={28} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--foreground-muted)]">No documents uploaded yet</p>
                    <p className="text-xs text-[var(--foreground-subtle)] mt-1">Upload lease agreement, ID proof, NOC etc.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {docs.map((doc) => (
                      <div key={doc.path} className="flex items-center gap-3 px-3 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl group hover:border-[var(--accent)]/40 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-[var(--accent)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">{doc.name.replace(/^\d+_/, "")}</p>
                          {doc.created_at && (
                            <p className="text-xs text-[var(--foreground-subtle)]">
                              {new Date(doc.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDownload(doc.path, doc.name.replace(/^\d+_/, ""))}
                            className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors" title="Download">
                            <Download size={14} />
                          </button>
                          <button onClick={() => handleDeleteDoc(doc.path)}
                            className="p-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Maintenance Tab */}
            {tab === "maintenance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Maintenance Tickets</h3>
                  <Button size="sm" onClick={() => { setEditTicket(null); setTicketFormOpen(true); }}>
                    <Plus size={13} /> New Ticket
                  </Button>
                </div>
                {ticketsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-[var(--accent)]" /></div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                    <Wrench size={32} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--foreground-muted)] mb-3">No maintenance tickets.</p>
                    <Button size="sm" onClick={() => setTicketFormOpen(true)}><Plus size={13} /> New Ticket</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-[var(--foreground)]">{ticket.title}</p>
                              <Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge>
                              <Badge variant={ticketStatusVariant[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                            </div>
                            {ticket.description && (
                              <p className="text-xs text-[var(--foreground-muted)] mb-2">{ticket.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)]">
                              <span className="capitalize">{ticket.category}</span>
                              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-3">
                            <Button variant="secondary" size="sm" onClick={() => { setEditTicket(ticket); setTicketFormOpen(true); }}><Pencil size={11} /></Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteTicketTarget(ticket)}><Trash2 size={11} /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Visitors Tab */}
            {tab === "visitors" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Visitor Requests</h3>
                  <Button size="sm" onClick={() => { setEditVisitor(null); setVisitorFormOpen(true); }}>
                    <Plus size={13} /> Add Visitor
                  </Button>
                </div>
                {visitorsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-[var(--accent)]" /></div>
                ) : visitors.length === 0 ? (
                  <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                    <Users size={32} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--foreground-muted)] mb-3">No visitor requests.</p>
                    <Button size="sm" onClick={() => setVisitorFormOpen(true)}><Plus size={13} /> Add Visitor</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {visitors.map((visitor) => (
                      <div key={visitor.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-[var(--foreground)]">{visitor.visitor_name}</p>
                              <Badge variant={visitorStatusVariant[visitor.status]}>{visitor.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
                              {visitor.visitor_phone && <span className="flex items-center gap-1"><Phone size={10} /> {visitor.visitor_phone}</span>}
                              {visitor.purpose && <span>{visitor.purpose}</span>}
                              {visitor.visit_date && <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(visitor.visit_date).toLocaleString()}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-3">
                            {visitor.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateVisitor(visitor.id, { status: "approved" })}>
                                  <CheckCircle2 size={11} /> Approve
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => updateVisitor(visitor.id, { status: "rejected" })}>
                                  <XCircle size={11} />
                                </Button>
                              </>
                            )}
                            <Button variant="secondary" size="sm" onClick={() => { setEditVisitor(visitor); setVisitorFormOpen(true); }}><Pencil size={11} /></Button>
                            <Button variant="danger" size="sm" onClick={() => setDeleteVisitorTarget(visitor)}><Trash2 size={11} /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {tenant && (
        <TenantFormModal
          open={editTenantOpen}
          onClose={() => setEditTenantOpen(false)}
          onSubmit={(d) => updateTenant(tenant.id, d)}
          initial={tenant}
          properties={properties}
        />
      )}

      <LeaseFormModal
        open={leaseFormOpen}
        onClose={() => { setLeaseFormOpen(false); setEditLease(null); }}
        onSubmit={editLease ? (d) => updateLease(editLease.id, d) : addLease}
        initial={editLease}
        tenantId={id}
        propertyId={tenant?.property_id}
      />

      <MaintenanceTicketModal
        open={ticketFormOpen}
        onClose={() => { setTicketFormOpen(false); setEditTicket(null); }}
        onSubmit={editTicket ? (d) => updateTicket(editTicket.id, d) : addTicket}
        initial={editTicket}
        tenantId={id}
        propertyId={tenant?.property_id}
      />

      <VisitorModal
        open={visitorFormOpen}
        onClose={() => { setVisitorFormOpen(false); setEditVisitor(null); }}
        onSubmit={editVisitor ? (d) => updateVisitor(editVisitor.id, d) : addVisitor}
        initial={editVisitor}
        tenantId={id}
      />

      <ConfirmModal
        open={deleteTenantConfirm}
        onClose={() => setDeleteTenantConfirm(false)}
        onConfirm={handleDeleteTenant}
        loading={deleteTenantLoading}
        title="Delete Tenant"
        message={`Delete "${tenant?.name}"? This will also remove their lease, maintenance tickets, and visitor records.`}
        confirmLabel="Delete Tenant"
      />
      <ConfirmModal
        open={!!deleteLeaseTarget}
        onClose={() => setDeleteLeaseTarget(null)}
        onConfirm={handleDeleteLease}
        loading={deleteLeaseLoading}
        title="Delete Lease"
        message="Delete this lease record?"
        confirmLabel="Delete Lease"
      />
      <ConfirmModal
        open={!!deleteTicketTarget}
        onClose={() => setDeleteTicketTarget(null)}
        onConfirm={handleDeleteTicket}
        loading={deleteTicketLoading}
        title="Delete Ticket"
        message={`Delete ticket "${deleteTicketTarget?.title}"?`}
        confirmLabel="Delete Ticket"
      />
      <ConfirmModal
        open={!!deleteVisitorTarget}
        onClose={() => setDeleteVisitorTarget(null)}
        onConfirm={handleDeleteVisitor}
        loading={deleteVisitorLoading}
        title="Delete Visitor"
        message={`Delete visitor request for "${deleteVisitorTarget?.visitor_name}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
