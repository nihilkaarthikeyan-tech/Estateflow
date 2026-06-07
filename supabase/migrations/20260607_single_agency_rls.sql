-- ============================================================
-- CONVERT TO SINGLE-AGENCY (single-user) behaviour
--
-- This app is a single-client demo, NOT a multi-tenant SaaS. The live DB was
-- originally built from the multi-tenant schema (org-scoped RLS), which meant
-- each signup got an isolated org and saw only its own data.
--
-- This migration removes that org gating: ANY authenticated user now sees ALL
-- the data — one shared system. Organization_id columns are left in place
-- (harmless / ignored) so existing code that still references them keeps working.
--
-- Safe to run multiple times. Does NOT delete any of your data.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1) Drop every existing policy on the app tables (whatever they were named) ──
do $$
declare
  r record;
  tbls text[] := array[
    'profiles','organizations','properties','leads','conversations','visits',
    'tenants','leases','maintenance_tickets','visitors','notifications',
    'payment_schedules'
  ];
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public' and tablename = any(tbls)
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 2) Make sure RLS is enabled on each (recreate open policies below) ──────────
alter table public.profiles            enable row level security;
alter table public.organizations       enable row level security;
alter table public.properties          enable row level security;
alter table public.leads               enable row level security;
alter table public.conversations       enable row level security;
alter table public.visits              enable row level security;
alter table public.tenants             enable row level security;
alter table public.leases              enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.visitors            enable row level security;
alter table public.notifications       enable row level security;
alter table public.payment_schedules   enable row level security;

-- 3) Open single-user policies ───────────────────────────────────────────────

-- profiles: everyone can read; you can update your own
create policy "su_profiles_select" on public.profiles for select using (true);
create policy "su_profiles_update" on public.profiles for update using (id = auth.uid());

-- organizations: any authenticated user
create policy "su_org_all" on public.organizations for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- properties: public read (powers /listings + public pages), authenticated write
create policy "su_properties_select" on public.properties for select using (true);
create policy "su_properties_write"  on public.properties for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- visits: public read (booking confirmation), authenticated manage
create policy "su_visits_select" on public.visits for select using (true);
create policy "su_visits_write"  on public.visits for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- leads / conversations / tenants / leases / tickets / visitors / payments:
-- any authenticated user sees and manages everything
create policy "su_leads_all" on public.leads for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_conversations_all" on public.conversations for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_tenants_all" on public.tenants for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_leases_all" on public.leases for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_maintenance_all" on public.maintenance_tickets for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_visitors_all" on public.visitors for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "su_payment_schedules_all" on public.payment_schedules for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- notifications: each user sees their own; system (service role) can insert
create policy "su_notifications_select" on public.notifications for select
  using (user_id = auth.uid());
create policy "su_notifications_update" on public.notifications for update
  using (user_id = auth.uid());
create policy "su_notifications_insert" on public.notifications for insert
  with check (true);
