"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Home, MoreVertical,
  Pencil, Trash2, Eye, Bed, Bath, Maximize2,
} from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import PropertyFilterPanel from "@/components/properties/PropertyFilterPanel";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useProperties, defaultFilters, type PropertyFilters } from "@/lib/hooks/useProperties";
import type { Property, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusBadge: Record<PropertyStatus, "success" | "warning" | "default" | "danger"> = {
  available: "success",
  reserved: "warning",
  upcoming: "accent" as never,
  sold: "default",
};

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertiesPage() {
  const { properties, loading, addProperty, updateProperty, deleteProperty, fetchProperties } = useProperties();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Property | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const applyFilters = useCallback(() => {
    fetchProperties({ ...filters, search });
  }, [filters, search, fetchProperties]);

  function openAdd() { setEditTarget(null); setFormOpen(true); }
  function openEdit(p: Property) { setEditTarget(p); setFormOpen(true); setMenuOpen(null); }

  async function handleFormSubmit(data: Omit<Property, "id" | "created_at">) {
    if (editTarget) {
      return await updateProperty(editTarget.id, data);
    }
    return await addProperty(data);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteProperty(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  const hasActiveFilters = filters.city || filters.status || filters.property_type || filters.min_beds !== "" || filters.max_price !== "";

  const displayed = search
    ? properties.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        (p.city ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : properties;

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Properties" subtitle={`${properties.length} listing${properties.length !== 1 ? "s" : ""}`} />

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
            <Search size={15} className="text-[var(--foreground-muted)] shrink-0" />
            <input
              placeholder="Search properties…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none flex-1"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterOpen(true)}
            className={cn(hasActiveFilters && "border-[var(--accent)] text-[var(--accent)]")}
          >
            <Filter size={14} />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
                ON
              </span>
            )}
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} /> Add Property
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
                <div className="h-44 bg-[var(--surface-2)]" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-[var(--surface-3)] rounded w-3/4" />
                  <div className="h-5 bg-[var(--surface-3)] rounded w-1/2" />
                  <div className="h-3 bg-[var(--surface-3)] rounded w-2/3" />
                </div>
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
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=300&q=80"
                alt=""
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Home size={28} className="text-[var(--foreground-subtle)]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">No properties found</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                {hasActiveFilters || search ? "Try adjusting your filters." : "Add your first property to get started."}
              </p>
            </div>
            {!hasActiveFilters && !search && (
              <Button size="sm" onClick={openAdd}>
                <Plus size={14} /> Add Property
              </Button>
            )}
          </motion.div>
        )}

        {/* Property grid */}
        {!loading && displayed.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayed.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--border-strong)] transition-colors duration-200 group relative"
                >
                  {/* Image / placeholder */}
                  <div className="h-44 bg-[var(--surface-2)] relative overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
                          alt="Property placeholder"
                          className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-white/10">
                            <Home size={13} className="text-white/50" />
                            <span className="text-xs text-white/50">No photo</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Status badge over image */}
                    <div className="absolute top-3 left-3">
                      <Badge variant={statusBadge[p.status]}>{p.status}</Badge>
                    </div>

                    {/* Actions menu */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }}
                        className="p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical size={14} />
                      </button>

                      <AnimatePresence>
                        {menuOpen === p.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden w-40 z-20"
                          >
                            <Link
                              href={`/dashboard/properties/${p.id}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                            >
                              <Eye size={13} /> View
                            </Link>
                            <button
                              onClick={() => openEdit(p)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              onClick={() => { setDeleteTarget(p); setMenuOpen(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card body */}
                  <Link href={`/dashboard/properties/${p.id}`} className="block p-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug mb-1 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-lg font-bold text-[var(--accent)] mb-3">
                      {formatPrice(p.price)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)] flex-wrap">
                      <span>{p.city ?? p.location}</span>
                      {p.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed size={11} /> {p.bedrooms}
                        </span>
                      )}
                      {p.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath size={11} /> {p.bathrooms}
                        </span>
                      )}
                      {p.area > 0 && (
                        <span className="flex items-center gap-1">
                          <Maximize2 size={11} /> {p.area.toLocaleString()} sq ft
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <PropertyFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initial={editTarget}
      />

      <PropertyFilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onApply={applyFilters}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Property"
      />

      {/* Close menu on outside click */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}
