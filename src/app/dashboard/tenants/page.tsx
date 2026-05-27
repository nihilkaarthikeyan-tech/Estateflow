"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Phone, Mail, Home, Loader2, Pencil, Trash2, UserSquare2, CheckCircle2, Clock } from "lucide-react";

const TENANT_IMGS = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=70",
];
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import TenantFormModal from "@/components/tenants/TenantFormModal";
import ProfileFix from "@/components/ProfileFix";
import { useTenants } from "@/lib/hooks/useTenants";
import type { Tenant, TenantStatus } from "@/types";
import Link from "next/link";

const statusVariant: Record<TenantStatus, "success" | "warning" | "default"> = {
  active: "success", pending: "warning", inactive: "default",
};

export default function TenantsPage() {
  const { tenants, loading, error, addTenant, updateTenant, deleteTenant } = useTenants();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    createClient().from("properties").select("id, title").eq("status", "available")
      .then(({ data }) => setProperties((data ?? []) as { id: string; title: string }[]));
  }, []);

  const filtered = tenants.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone?.includes(search) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    pending: tenants.filter((t) => t.status === "pending").length,
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteTenant(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  // Enhanced addTenant wrapper to catch profile errors
  async function handleAddTenant(data: Omit<Tenant, "id" | "created_at">) {
    const result = await addTenant(data);
    if (result.error === "Profile not found") {
      setProfileError(true);
    }
    return result;
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Tenants" subtitle="Manage your rental tenants" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Profile Fix Component */}
        {(profileError || error === "Profile not found") && (
          <div className="mb-6">
            <ProfileFix />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Tenants", value: stats.total, icon: UserSquare2, color: "var(--accent)" },
            { label: "Active", value: stats.active, icon: CheckCircle2, color: "var(--success)" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "var(--warning)" },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4"
            >
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
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenants…"
              className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <Button size="sm" onClick={() => { setEditTarget(null); setFormOpen(true); }}>
            <Plus size={14} /> Add Tenant
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <UserSquare2 size={40} className="text-[var(--foreground-subtle)] mx-auto mb-3" />
            <p className="text-[var(--foreground-muted)] mb-4">{search ? "No tenants match your search." : "No tenants yet. Add your first tenant."}</p>
            {!search && <Button size="sm" onClick={() => setFormOpen(true)}><Plus size={14} /> Add Tenant</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((tenant, i) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/40 transition-colors group"
              >
                {/* Property image strip */}
                <div className="relative h-24 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={TENANT_IMGS[i % TENANT_IMGS.length]}
                    alt=""
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--surface)]" />
                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant={statusVariant[tenant.status]}>{tenant.status}</Badge>
                  </div>
                </div>

                <div className="p-4 -mt-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] font-bold text-sm shrink-0">
                    {tenant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link href={`/dashboard/tenants/${tenant.id}`}>
                      <p className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">{tenant.name}</p>
                    </Link>
                    {tenant.unit_number && (
                      <p className="text-xs text-[var(--foreground-muted)]">Unit {tenant.unit_number}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-3">
                  {tenant.phone && (
                    <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                      <Phone size={11} className="text-[var(--accent)]" /> {tenant.phone}
                    </div>
                  )}
                  {tenant.email && (
                    <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                      <Mail size={11} className="text-[var(--accent)]" /> {tenant.email}
                    </div>
                  )}
                  {tenant.property_id && (
                    <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                      <Home size={11} className="text-[var(--accent)]" />
                      {properties.find((p) => p.id === tenant.property_id)?.title ?? "Property linked"}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/tenants/${tenant.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">View</Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => { setEditTarget(tenant); setFormOpen(true); }}>
                    <Pencil size={12} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(tenant)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
                </div>{/* end p-4 */}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <TenantFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={editTarget ? (d) => updateTenant(editTarget.id, d) : handleAddTenant}
        initial={editTarget}
        properties={properties}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Tenant"
        message={`Delete "${deleteTarget?.name}"? This will also remove their lease and ticket records.`}
        confirmLabel="Delete Tenant"
      />
    </div>
  );
}
