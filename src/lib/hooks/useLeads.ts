"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadStage, LeadUrgency } from "@/types";

export interface LeadFilters {
  search: string;
  stage: LeadStage | "";
  urgency: LeadUrgency | "";
  assigned_to: string;
  source: string;
}

export const defaultLeadFilters: LeadFilters = {
  search: "",
  stage: "",
  urgency: "",
  assigned_to: "",
  source: "",
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (filters: LeadFilters = defaultLeadFilters) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,location.ilike.%${filters.search}%,raw_message.ilike.%${filters.search}%`
      );
    }
    if (filters.stage) query = query.eq("status", filters.stage);
    if (filters.urgency) query = query.eq("urgency", filters.urgency);
    if (filters.assigned_to) query = query.eq("assigned_to", filters.assigned_to);
    if (filters.source) query = query.eq("source", filters.source);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function addLead(payload: Omit<Lead, "id" | "created_at" | "ai_analyzed">) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select()
      .single();

    if (error) return { data, error: error.message };

    // Enrich just like a web/WhatsApp lead: AI summary + Golden Visa flag +
    // first-touch follow-up. Best-effort — a failure must never block the add.
    let lead = data as Lead;
    try {
      const res = await fetch("/api/leads/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      });
      if (res.ok) {
        const { lead: enriched } = await res.json();
        if (enriched) lead = enriched as Lead;
      }
    } catch { /* enrichment is best-effort */ }

    setLeads((prev) => [lead, ...prev]);
    return { data: lead, error: undefined };
  }

  async function updateLead(id: string, payload: Partial<Lead>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setLeads((prev) => prev.map((l) => (l.id === id ? (data as Lead) : l)));
    }
    return { data, error: error?.message };
  }

  async function deleteLead(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
    return { error: error?.message };
  }

  return { leads, loading, error, fetchLeads, addLead, updateLead, deleteLead };
}