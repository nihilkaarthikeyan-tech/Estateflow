-- ============================================================
-- EstateFlow AI — Single User Database Schema
-- Run this entire file in your Supabase SQL Editor
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- TABLE: profiles
-- Extends Supabase auth.users with personal info
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  avatar_url       text,
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: properties
-- ─────────────────────────────────────────────
create table if not exists public.properties (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  price            numeric not null,
  location         text not null,
  city             text,
  description      text,
  bedrooms         integer default 0,
  bathrooms        integer default 0,
  area             numeric,
  amenities        text[] default '{}',
  images           text[] default '{}',
  videos           text[] default '{}',
  status           text not null default 'available'
                   check (status in ('available', 'sold', 'reserved', 'upcoming')),
  property_type    text,
  furnishing       text,
  tour_url         text,
  created_by       uuid references auth.users(id) default auth.uid(),
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: leads
-- ─────────────────────────────────────────────
create table if not exists public.leads (
  id               uuid primary key default uuid_generate_v4(),
  raw_message      text,
  name             text,
  phone            text,
  email            text,
  -- AI extracted fields
  budget           text,
  location         text,
  property_type    text,
  urgency          text default 'medium'
                   check (urgency in ('high', 'medium', 'low')),
  buyer_intent     text default 'researching'
                   check (buyer_intent in ('serious', 'researching', 'comparing')),
  summary          text,
  -- CRM fields
  status           text not null default 'new'
                   check (status in ('new','contacted','qualified','site_visit','negotiation','closed','lost')),
  assigned_to      uuid references auth.users(id),
  source           text default 'web_form'
                   check (source in ('web_form', 'whatsapp', 'referral', 'manual')),
  notes            text,
  visit_date       timestamp with time zone,
  ai_analyzed      boolean default false,
  -- AED 2M+ Golden Visa pipeline flag (auto-set by AI lead analysis)
  golden_visa      boolean default false,
  -- Post-sale referral lifecycle (Workflow 09)
  closed_at                  timestamp with time zone,
  referral_followup_sent_at  timestamp with time zone,
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: conversations
-- ─────────────────────────────────────────────
create table if not exists public.conversations (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  user_id     uuid references auth.users(id),
  message     text not null,
  direction   text not null default 'inbound'
              check (direction in ('inbound', 'outbound')),
  created_at  timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: visits
-- Site visit scheduling
-- ─────────────────────────────────────────────
create table if not exists public.visits (
  id               uuid primary key default uuid_generate_v4(),
  property_id      uuid references public.properties(id) on delete set null,
  lead_id          uuid references public.leads(id) on delete set null,
  visitor_name     text not null,
  visitor_phone    text not null,
  visitor_email    text,
  visit_date       date not null,
  visit_time       text not null default '10:00',
  status           text not null default 'scheduled'
                   check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes            text,
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: tenants (for future property management)
-- ─────────────────────────────────────────────
create table if not exists public.tenants (
  id               uuid primary key default uuid_generate_v4(),
  property_id      uuid references public.properties(id) on delete set null,
  name             text not null,
  phone            text,
  email            text,
  unit_number      text,
  status           text not null default 'active'
                   check (status in ('active', 'inactive', 'pending')),
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: leases (for future property management)
-- ─────────────────────────────────────────────
create table if not exists public.leases (
  id               uuid primary key default uuid_generate_v4(),
  tenant_id        uuid not null references public.tenants(id) on delete cascade,
  property_id      uuid references public.properties(id) on delete set null,
  start_date       date not null,
  end_date         date not null,
  monthly_rent     numeric not null,
  deposit          numeric not null,
  status           text not null default 'active'
                   check (status in ('active', 'expired', 'terminated')),
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: payment_schedules
-- Off-plan installment milestones (Workflow 06 — Off-Plan Payment Reminder)
-- ─────────────────────────────────────────────
create table if not exists public.payment_schedules (
  id                uuid primary key default uuid_generate_v4(),
  property_id       uuid references public.properties(id) on delete set null,
  lead_id           uuid references public.leads(id) on delete set null,
  buyer_name        text not null,
  buyer_phone       text not null,
  project_name      text not null,
  developer         text,
  installment_label text,
  amount            numeric not null,
  due_date          date not null,
  bank_details      text,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'overdue')),
  reminder_sent_at  timestamp with time zone,
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: maintenance_tickets (for future property management)
-- ─────────────────────────────────────────────
create table if not exists public.maintenance_tickets (
  id               uuid primary key default uuid_generate_v4(),
  tenant_id        uuid references public.tenants(id) on delete set null,
  property_id      uuid references public.properties(id) on delete set null,
  title            text not null,
  description      text,
  category         text not null default 'general'
                   check (category in ('plumbing', 'electrical', 'carpentry', 'cleaning', 'security', 'general')),
  priority         text not null default 'medium'
                   check (priority in ('high', 'medium', 'low')),
  status           text not null default 'open'
                   check (status in ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to      uuid references auth.users(id),
  resolved_at      timestamp with time zone,
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: visitors (for future property management)
-- ─────────────────────────────────────────────
create table if not exists public.visitors (
  id               uuid primary key default uuid_generate_v4(),
  tenant_id        uuid references public.tenants(id) on delete set null,
  visitor_name     text not null,
  visitor_phone    text,
  purpose          text,
  visit_date       timestamp with time zone,
  status           text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: notifications
-- ─────────────────────────────────────────────
create table if not exists public.notifications (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  message          text not null,
  type             text default 'info'
                   check (type in ('info', 'lead', 'follow_up', 'ai')),
  read             boolean default false,
  link             text,
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- Auto-updates updated_at on row changes
-- ─────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_properties on public.properties;
create trigger set_updated_at_properties
  before update on public.properties
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_leads on public.leads;
create trigger set_updated_at_leads
  before update on public.leads
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_maintenance on public.maintenance_tickets;
create trigger set_updated_at_maintenance
  before update on public.maintenance_tickets
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_updated_at_payment_schedules on public.payment_schedules;
create trigger set_updated_at_payment_schedules
  before update on public.payment_schedules
  for each row execute procedure public.handle_updated_at();

-- ─────────────────────────────────────────────
-- LEAD CLOSED_AT TRIGGER
-- Stamps closed_at when a lead enters 'closed', clears it (and the referral
-- guard) if it moves back out. Drives Workflow 09 (Post-Sale Referral).
-- ─────────────────────────────────────────────
create or replace function public.handle_lead_closed_at()
returns trigger as $$
begin
  if new.status = 'closed' and (old.status is distinct from 'closed') then
    new.closed_at = now();
  elsif new.status <> 'closed' then
    new.closed_at = null;
    new.referral_followup_sent_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_lead_closed_at on public.leads;
create trigger set_lead_closed_at
  before update on public.leads
  for each row execute procedure public.handle_lead_closed_at();

-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE TRIGGER
-- When a user signs up via Supabase Auth,
-- automatically create their profile row
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- All data belongs to the authenticated user
-- ─────────────────────────────────────────────

-- ── profiles ──
alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- ── properties ──
alter table public.properties enable row level security;

create policy "Anyone can view properties"
  on public.properties for select
  using (true);

create policy "Authenticated users can insert properties"
  on public.properties for insert
  with check (auth.uid() is not null);

create policy "Users can update properties they created"
  on public.properties for update
  using (created_by = auth.uid() or created_by is null);

create policy "Users can delete properties they created"
  on public.properties for delete
  using (created_by = auth.uid() or created_by is null);

-- ── leads ──
alter table public.leads enable row level security;

create policy "Authenticated users can view all leads"
  on public.leads for select
  using (auth.uid() is not null);

create policy "Authenticated users can insert leads"
  on public.leads for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update leads"
  on public.leads for update
  using (auth.uid() is not null);

create policy "Authenticated users can delete leads"
  on public.leads for delete
  using (auth.uid() is not null);

-- ── conversations ──
alter table public.conversations enable row level security;

create policy "Authenticated users can view conversations"
  on public.conversations for select
  using (auth.uid() is not null);

create policy "Authenticated users can insert conversations"
  on public.conversations for insert
  with check (auth.uid() is not null);

-- ── visits ──
alter table public.visits enable row level security;

create policy "Anyone can view visits"
  on public.visits for select
  using (true);

create policy "Authenticated users can manage visits"
  on public.visits for all
  using (auth.uid() is not null);

-- ── tenants ──
alter table public.tenants enable row level security;

create policy "Authenticated users can manage tenants"
  on public.tenants for all
  using (auth.uid() is not null);

-- ── leases ──
alter table public.leases enable row level security;

create policy "Authenticated users can manage leases"
  on public.leases for all
  using (auth.uid() is not null);

-- ── payment_schedules ──
alter table public.payment_schedules enable row level security;

create policy "Authenticated users can manage payment schedules"
  on public.payment_schedules for all
  using (auth.uid() is not null);

-- ── maintenance_tickets ──
alter table public.maintenance_tickets enable row level security;

create policy "Authenticated users can manage maintenance tickets"
  on public.maintenance_tickets for all
  using (auth.uid() is not null);

-- ── visitors ──
alter table public.visitors enable row level security;

create policy "Authenticated users can manage visitors"
  on public.visitors for all
  using (auth.uid() is not null);

-- ── notifications ──
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update their own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

-- ─────────────────────────────────────────────
-- INDEXES (for query performance)
-- ─────────────────────────────────────────────
create index if not exists idx_properties_created_by on public.properties(created_by);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_urgency on public.leads(urgency);
create index if not exists idx_leads_assigned on public.leads(assigned_to);
create index if not exists idx_leads_closed_at on public.leads(closed_at);
create index if not exists idx_leads_golden_visa on public.leads(golden_visa) where golden_visa = true;
create index if not exists idx_payment_schedules_due on public.payment_schedules(due_date);
create index if not exists idx_payment_schedules_status on public.payment_schedules(status);
create index if not exists idx_conversations_lead on public.conversations(lead_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_visits_date on public.visits(visit_date);
create index if not exists idx_tenants_property on public.tenants(property_id);
create index if not exists idx_leases_tenant on public.leases(tenant_id);
create index if not exists idx_maintenance_property on public.maintenance_tickets(property_id);
create index if not exists idx_visitors_tenant on public.visitors(tenant_id);