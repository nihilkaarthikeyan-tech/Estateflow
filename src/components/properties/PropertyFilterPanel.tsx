"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import type { PropertyFilters } from "@/lib/hooks/useProperties";
import { defaultFilters } from "@/lib/hooks/useProperties";

interface PropertyFilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onChange: (f: PropertyFilters) => void;
  onApply: () => void;
}

const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
  { label: "Upcoming", value: "upcoming" },
];

const typeOptions = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Independent House", value: "independent_house" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Studio", value: "studio" },
];

const bedsOptions = [
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

export default function PropertyFilterPanel({ open, onClose, filters, onChange, onApply }: PropertyFilterPanelProps) {
  const set = (field: keyof PropertyFilters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [field]: e.target.value });

  function reset() {
    onChange(defaultFilters);
    onApply();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-80 bg-[var(--surface)] border-l border-[var(--border)] z-40 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Filter Properties</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
              <Input
                label="City"
                placeholder="Dubai, Abu Dhabi…"
                value={filters.city}
                onChange={set("city")}
              />
              <Select
                label="Property Type"
                value={filters.property_type}
                onChange={set("property_type")}
                options={typeOptions}
                placeholder="All types"
              />
              <Select
                label="Status"
                value={filters.status}
                onChange={set("status")}
                options={statusOptions}
                placeholder="All statuses"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--foreground-muted)]">Min. Bedrooms</label>
                <div className="flex gap-2">
                  {bedsOptions.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => onChange({ ...filters, min_beds: filters.min_beds === Number(b.value) ? "" : Number(b.value) })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        filters.min_beds === Number(b.value)
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                          : "bg-[var(--surface-2)] border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Max Price (AED)"
                type="number"
                placeholder="e.g. 10000000"
                value={filters.max_price || ""}
                onChange={(e) => onChange({ ...filters, max_price: e.target.value ? Number(e.target.value) : "" })}
              />
            </div>

            <div className="px-5 py-4 border-t border-[var(--border)] flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={reset}>Reset</Button>
              <Button className="flex-1" onClick={() => { onApply(); onClose(); }}>Apply</Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
