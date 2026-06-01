"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import {
  Users, Home, TrendingUp, Brain, RefreshCw, Loader2, Lightbulb,
} from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import StatCard from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

const SOURCE_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#f59e0b", "#22c55e", "#ef4444"];

const PIE_RADIAN = Math.PI / 180;
function PieLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  if (
    cx == null || cy == null || midAngle == null ||
    innerRadius == null || outerRadius == null ||
    percent == null || (percent as number) < 0.05
  ) return null;
  const r = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
  const x = (cx as number) + r * Math.cos(-(midAngle as number) * PIE_RADIAN);
  const y = (cy as number) + r * Math.sin(-(midAngle as number) * PIE_RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {String(name ?? "").slice(0, 3).toUpperCase()}
    </text>
  );
}

function SkeletonCard({ h = 240 }: { h?: number }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 animate-pulse">
      <div className="h-4 w-32 bg-[var(--surface-3)] rounded mb-4" />
      <div className="bg-[var(--surface-3)] rounded-lg" style={{ height: h }} />
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-[var(--foreground-muted)] mb-1">{label}</p>
      <p className="text-[var(--foreground)] font-semibold">{payload[0].value} leads</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-[var(--foreground-muted)] mb-1">{label}</p>
      <p className="text-[var(--foreground)] font-semibold">{payload[0].value} leads</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, loading } = useAnalytics();
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  async function loadInsights() {
    setInsightsLoading(true);
    setInsightsError("");
    const res = await fetch("/api/generate-insights", { method: "POST" });
    const json = await res.json();
    if (json.error) setInsightsError(json.error);
    else setInsights(json.insights ?? []);
    setInsightsLoading(false);
  }

  // Format daily date labels for chart
  const volumeData = (data?.dailyVolume ?? []).map((d, i) => ({
    ...d,
    label: i % 5 === 0 ? new Date(d.date).toLocaleDateString("en-AE", { month: "short", day: "numeric" }) : "",
  }));

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Analytics" subtitle="Real-time performance metrics" />

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">

        {/* Analytics banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1624317938116-5050f2b0965c?auto=format&fit=crop&w=1920&q=60"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: "var(--accent)" }}>Real-Time Metrics</p>
              <p className="text-lg font-bold text-[var(--foreground)] leading-tight">Pipeline Performance</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Live data from all your lead channels</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">Live</span>
              </div>
              <span className="text-[10px] text-[var(--foreground-subtle)]">Updates in real time</span>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
            ))
          ) : (
            <>
              <StatCard title="Total Leads" value={String(data?.totalLeads ?? 0)} icon={Users} positive />
              <StatCard title="Available Properties" value={String(data?.totalProperties ?? 0)} icon={Home} positive />
              <StatCard
                title="Conversion Rate"
                value={`${data?.conversionRate ?? 0}%`}
                icon={TrendingUp}
                positive={(data?.conversionRate ?? 0) > 0}
              />
              <StatCard
                title="AI Analyzed"
                value={`${data?.aiAnalyzedPct ?? 0}%`}
                icon={Brain}
                positive={(data?.aiAnalyzedPct ?? 0) > 50}
              />
            </>
          )}
        </motion.div>

        {/* Lead Volume Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          {loading ? <SkeletonCard h={200} /> : (
            <Card>
              <CardHeader>
                <CardTitle>Lead Volume — Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                {volumeData.every((d) => d.leads === 0) ? (
                  <div className="h-48 flex items-center justify-center text-[var(--foreground-subtle)] text-sm">
                    No leads in the last 30 days
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={volumeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#8a8f98", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#8a8f98", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        fill="url(#leadGradient)"
                        dot={false}
                        activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pipeline Funnel */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {loading ? <SkeletonCard /> : (
              <Card>
                <CardHeader><CardTitle>Pipeline Funnel</CardTitle></CardHeader>
                <CardContent>
                  {!data?.byStage.length ? (
                    <div className="h-52 flex items-center justify-center text-[var(--foreground-subtle)] text-sm">
                      No pipeline data yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={data.byStage}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        barSize={28}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="stage"
                          tick={{ fill: "#8a8f98", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#8a8f98", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<BarTooltip />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {data.byStage.map((entry, index) => (
                            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Lead Source Breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            {loading ? <SkeletonCard /> : (
              <Card>
                <CardHeader><CardTitle>Lead Sources</CardTitle></CardHeader>
                <CardContent>
                  {!data?.bySource.length ? (
                    <div className="h-52 flex items-center justify-center text-[var(--foreground-subtle)] text-sm">
                      No source data yet
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="55%" height={200}>
                        <PieChart>
                          <Pie
                            data={data.bySource}
                            dataKey="count"
                            nameKey="source"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={50}
                            labelLine={false}
                            label={PieLabel}
                          >
                            {data.bySource.map((_, index) => (
                              <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value} leads`, name]}
                            contentStyle={{
                              background: "var(--surface-2)",
                              border: "1px solid var(--border-strong)",
                              borderRadius: 8,
                              fontSize: 12,
                              color: "var(--foreground)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-2">
                        {data.bySource.map((s, i) => (
                          <div key={s.source} className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                            />
                            <span className="text-xs text-[var(--foreground-muted)] capitalize">{s.source}</span>
                            <span className="text-xs font-semibold text-[var(--foreground)] ml-auto">{s.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top Locations */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {loading ? <SkeletonCard h={180} /> : (
              <Card>
                <CardHeader><CardTitle>Top Locations</CardTitle></CardHeader>
                <CardContent>
                  {!data?.topLocations.length ? (
                    <div className="py-8 text-center text-[var(--foreground-subtle)] text-sm">
                      No location data — AI-analyze leads to extract locations
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {data.topLocations.map((loc) => (
                        <div key={loc.location}>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-[var(--foreground)] font-medium">{loc.location}</span>
                            <span className="text-[var(--foreground-muted)] text-xs">{loc.count} leads</span>
                          </div>
                          <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${loc.pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: "var(--accent)" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Agent Performance */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
            {loading ? <SkeletonCard h={180} /> : (
              <Card>
                <CardHeader><CardTitle>Agent Performance</CardTitle></CardHeader>
                <CardContent>
                  {!data?.agentPerformance.length ? (
                    <div className="py-8 text-center text-[var(--foreground-subtle)] text-sm">
                      Assign leads to agents to see performance here
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-[var(--border)]">
                      <div className="grid grid-cols-4 pb-2 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                        <span>Agent</span>
                        <span className="text-right">Leads</span>
                        <span className="text-right">Closed</span>
                        <span className="text-right">Rate</span>
                      </div>
                      {data.agentPerformance.map((a) => (
                        <div key={a.name} className="grid grid-cols-4 py-2.5 text-sm items-center">
                          <span className="text-[var(--foreground)] font-medium truncate">{a.name}</span>
                          <span className="text-right text-[var(--foreground-muted)]">{a.leads}</span>
                          <span className="text-right text-[var(--foreground-muted)]">{a.closed}</span>
                          <span className="text-right text-[var(--success)] font-semibold">{a.rate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={15} className="text-[var(--accent)]" />
                  <CardTitle>AI Insights</CardTitle>
                </div>
                <Button size="sm" variant="secondary" onClick={loadInsights} disabled={insightsLoading}>
                  {insightsLoading
                    ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                    : <><RefreshCw size={13} /> {insights.length ? "Refresh" : "Generate Insights"}</>
                  }
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {insightsError && (
                <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg mb-3">
                  {insightsError}
                </p>
              )}
              {insightsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-[var(--surface-2)] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : insights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-2.5 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]"
                    >
                      <Lightbulb size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Brain size={28} className="text-[var(--foreground-subtle)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">No insights yet</p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      Click &ldquo;Generate Insights&rdquo; to get AI-powered analysis of your lead data.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
