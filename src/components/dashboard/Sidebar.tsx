"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
  UserSquare2,
  Wrench,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/provider";
import { useDashboard } from "./DashboardShell";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Properties", href: "/dashboard/properties", icon: Home, exact: false },
  { label: "Leads", href: "/dashboard/leads", icon: Users, exact: false },
  { label: "Tenants", href: "/dashboard/tenants", icon: UserSquare2, exact: false },
  { label: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, exact: false },
  { label: "Visits", href: "/dashboard/visits", icon: CalendarCheck, exact: false },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, exact: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, org, signOut } = useAuth();
  const { mobileOpen, setMobileOpen } = useDashboard();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[240px] flex flex-col z-50 transition-transform duration-300 ease-out",
          "bg-[var(--surface)] border-r border-[var(--border-strong)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 shrink-0 border-b border-[var(--border)]">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
              boxShadow: "0 4px 16px var(--accent-glow)",
            }}
          >
            <Building2 size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[var(--foreground)] leading-none">
              Estate<span className="gradient-text">Flow</span>
            </p>
            {org && (
              <p className="text-[10px] text-[var(--foreground-subtle)] truncate mt-0.5">
                {org.name}
              </p>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-[var(--foreground-subtle)] tracking-widest uppercase">
            Menu
          </p>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white shadow-[0_4px_16px_var(--accent-glow)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                )}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                      }
                    : undefined
                }
              >
                <item.icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Property showcase */}
        <div className="mx-3 mb-2 rounded-xl overflow-hidden relative" style={{ height: "76px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.18) 100%)" }} />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
            <p className="text-[9px] font-bold text-white/70 uppercase tracking-[0.15em]">AI-Powered CRM</p>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] text-emerald-400 font-bold">LIVE</span>
            </div>
          </div>
        </div>

        <div className="px-3 pb-4 flex flex-col gap-1 border-t border-[var(--border)] pt-3">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-all w-full"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Sign out</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate leading-none">
                {profile?.full_name ?? "Loading…"}
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)] capitalize mt-0.5">
                {profile?.role ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
