"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, User, Users, Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/provider";

interface TeamMember {
  id: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
}

export default function SettingsPage() {
  const { user, profile, org } = useAuth();

  // Org form
  const [orgForm, setOrgForm] = useState({ name: "", website: "", city: "" });
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({ full_name: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Team
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // Webhook info
  const [copied, setCopied] = useState(false);

  // Fetch full org row (includes website which OrgInfo doesn't expose)
  useEffect(() => {
    if (!org?.id) return;
    const supabase = createClient();
    supabase.from("organizations").select("name, website, city").eq("id", org.id).single()
      .then(({ data }) => {
        if (data) setOrgForm({
          name: (data as { name: string; website?: string; city?: string }).name ?? "",
          website: (data as { name: string; website?: string; city?: string }).website ?? "",
          city: (data as { name: string; website?: string; city?: string }).city ?? "",
        });
      });
  }, [org?.id]);

  useEffect(() => {
    if (profile) setProfileForm({ full_name: profile.full_name ?? "" });
  }, [profile]);

  useEffect(() => {
    async function loadTeam() {
      if (!profile?.organization_id) return;
      setTeamLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url")
        .eq("organization_id", profile.organization_id)
        .order("role");
      setTeam((data as TeamMember[]) ?? []);
      setTeamLoading(false);
    }
    loadTeam();
  }, [profile?.organization_id]);

  async function saveOrg() {
    if (!org?.id) return;
    setOrgSaving(true);
    const supabase = createClient();
    await supabase.from("organizations").update(orgForm).eq("id", org.id);
    setOrgSaving(false);
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 3000);
  }

  async function saveProfile() {
    if (!user?.id) return;
    setProfileSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: profileForm.full_name }).eq("id", user.id);
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function copyOrgId() {
    if (org?.id) {
      navigator.clipboard.writeText(org.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const initials = (name: string | null) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Settings" subtitle="Manage your organization and team" />

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
        <div className="max-w-3xl flex flex-col gap-5">

          {/* Organization */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-[var(--accent)]" />
                  <CardTitle>Organization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Agency Name"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Prestige Real Estate"
                    />
                    <Input
                      label="City"
                      value={orgForm.city}
                      onChange={(e) => setOrgForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Chennai"
                    />
                  </div>
                  <Input
                    label="Website"
                    value={orgForm.website}
                    onChange={(e) => setOrgForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />

                  {/* Org ID (for webhook / API) */}
                  {org?.id && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[var(--foreground-muted)]">Organization ID</label>
                      <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg px-3 py-2">
                        <code className="text-xs text-[var(--foreground-muted)] flex-1 truncate font-mono">{org.id}</code>
                        <button
                          onClick={copyOrgId}
                          className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
                        >
                          {copied ? <CheckCircle2 size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-[var(--foreground-subtle)]">
                        Use this as <code className="font-mono">NEXT_PUBLIC_ORG_ID</code> in your <code className="font-mono">.env.local</code> for the public lead form.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={saveOrg} disabled={orgSaving}>
                      {orgSaving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
                    </Button>
                    {orgSaved && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                        <CheckCircle2 size={13} /> Saved
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={15} className="text-[var(--accent)]" />
                  <CardTitle>Your Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {initials(profile?.full_name ?? null)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{profile?.full_name ?? "—"}</p>
                      <p className="text-xs text-[var(--foreground-muted)] capitalize">{profile?.role}</p>
                      <p className="text-xs text-[var(--foreground-subtle)]">{user?.email}</p>
                    </div>
                  </div>
                  <Input
                    label="Full Name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ full_name: e.target.value })}
                    placeholder="Your full name"
                  />
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={saveProfile} disabled={profileSaving}>
                      {profileSaving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Profile"}
                    </Button>
                    {profileSaved && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                        <CheckCircle2 size={13} /> Saved
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-[var(--accent)]" />
                    <CardTitle>Team Members</CardTitle>
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] bg-[var(--surface-2)] px-2.5 py-1 rounded-full">
                    {team.length} member{team.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {teamLoading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] animate-pulse" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-3 w-28 bg-[var(--surface-3)] rounded animate-pulse" />
                          <div className="h-2.5 w-40 bg-[var(--surface-3)] rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : team.length === 0 ? (
                  <p className="text-sm text-[var(--foreground-muted)] py-4 text-center">No team members yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-[var(--border)]">
                    {team.map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-xs font-semibold text-[var(--foreground)] shrink-0">
                            {initials(m.full_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{m.full_name ?? "—"}</p>
                            <p className="text-xs text-[var(--foreground-muted)] capitalize">{m.role}</p>
                          </div>
                        </div>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: m.role === "admin" ? "var(--accent-muted)" : "var(--surface-2)",
                            color: m.role === "admin" ? "var(--accent)" : "var(--foreground-muted)",
                          }}
                        >
                          {m.role === "admin" ? "Admin" : "Agent"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Integrations / Quick Links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader>
                <CardTitle>Integrations &amp; Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Public Lead Capture Form", href: "/submit-lead", desc: "Share this URL to capture leads from your website or WhatsApp bio" },
                    { label: "Book a Site Visit (Public)", href: "/book-visit", desc: "Share this URL so customers can book property visits themselves" },
                    { label: "Tenant Portal", href: "/tenant-portal", desc: "Share this URL with tenants — they can view lease, raise maintenance requests" },
                    { label: "Property Listings (Public)", href: "/listings", desc: "Public page showing all available properties with filters" },
                    { label: "n8n Automation Setup Guide", href: "https://github.com", desc: "See n8n/SETUP.md in your project for step-by-step automation setup" },
                    { label: "Supabase Dashboard", href: "https://supabase.com/dashboard", desc: "Manage your database, storage, and authentication" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{link.label}</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{link.desc}</p>
                      </div>
                      <ExternalLink size={13} className="text-[var(--foreground-subtle)] shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
