-- ============================================================
-- EstateFlow AI — Complete Database Schema
-- Run this entire file in your Supabase SQL Editor
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- TABLE: organizations
-- Each real estate agency is one organization
-- ─────────────────────────────────────────────
create table if not exists public.organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  website     text,
  city        text,
  created_at  timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: profiles
-- Extends Supabase auth.users with role + org
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  organization_id  uuid references public.organizations(id) on delete cascade,
  role             text not null default 'agent' check (role in ('admin', 'agent')),
  full_name        text,
  avatar_url       text,
  created_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: properties
-- ─────────────────────────────────────────────
create table if not exists public.properties (
  id               uuid primary key default uuid_generate_v4(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
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
  created_by       uuid references auth.users(id),
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- TABLE: leads
-- ─────────────────────────────────────────────
create table if not exists public.leads (
  id               uuid primary key default uuid_generate_v4(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
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
  ai_analyzed      boolean default false,
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
-- TABLE: notifications
-- ─────────────────────────────────────────────
create table if not exists public.notifications (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  organization_id  uuid not null references public.organizations(id) on delete cascade,
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
-- Every table is isolated by organization_id
-- ─────────────────────────────────────────────

-- Helper: get current user's organization_id
create or replace function public.get_org_id()
returns uuid as $$
  select organization_id from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Helper: get current user's role
create or replace function public.get_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- ── organizations ──
alter table public.organizations enable row level security;

create policy "Users can view their own organization"
  on public.organizations for select
  using (id = public.get_org_id());

create policy "Admins can update their organization"
  on public.organizations for update
  using (id = public.get_org_id() and public.get_role() = 'admin');

-- ── profiles ──
alter table public.profiles enable row level security;

create policy "Users can view profiles in their org"
  on public.profiles for select
  using (organization_id = public.get_org_id());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- ── properties ──
alter table public.properties enable row level security;

create policy "Users can view org properties"
  on public.properties for select
  using (organization_id = public.get_org_id());

create policy "Admins can insert properties"
  on public.properties for insert
  with check (organization_id = public.get_org_id() and public.get_role() = 'admin');

create policy "Admins can update properties"
  on public.properties for update
  using (organization_id = public.get_org_id() and public.get_role() = 'admin');

create policy "Admins can delete properties"
  on public.properties for delete
  using (organization_id = public.get_org_id() and public.get_role() = 'admin');

-- ── leads ──
alter table public.leads enable row level security;

create policy "Users can view org leads"
  on public.leads for select
  using (organization_id = public.get_org_id());

create policy "Users can insert leads"
  on public.leads for insert
  with check (organization_id = public.get_org_id());

create policy "Users can update org leads"
  on public.leads for update
  using (organization_id = public.get_org_id());

create policy "Admins can delete leads"
  on public.leads for delete
  using (organization_id = public.get_org_id() and public.get_role() = 'admin');

-- ── conversations ──
alter table public.conversations enable row level security;

create policy "Users can view conversations for org leads"
  on public.conversations for select
  using (
    lead_id in (
      select id from public.leads where organization_id = public.get_org_id()
    )
  );

create policy "Users can insert conversations"
  on public.conversations for insert
  with check (
    lead_id in (
      select id from public.leads where organization_id = public.get_org_id()
    )
  );

-- ── notifications ──
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update their own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

-- ─────────────────────────────────────────────
-- INDEXES (for query performance)
-- ─────────────────────────────────────────────
-- Added in UC1/UC2 update
alter table public.leads add column if not exists visit_date timestamp with time zone;
alter table public.properties add column if not exists tour_url text;

create index if not exists idx_profiles_org on public.profiles(organization_id);
create index if not exists idx_properties_org on public.properties(organization_id);
create index if not exists idx_leads_org on public.leads(organization_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_urgency on public.leads(urgency);
create index if not exists idx_leads_assigned on public.leads(assigned_to);
create index if not exists idx_conversations_lead on public.conversations(lead_id);
create index if not exists idx_notifications_user on public.notifications(user_id);

-- ─────────────────────────────────────────────
-- TABLE: visits
-- Site visit scheduling
-- ─────────────────────────────────────────────
create table if not exists public.visits (
  id               uuid primary key default uuid_generate_v4(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
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

alter table public.visits enable row level security;

create policy "org_visits_select" on public.visits for select
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));

create policy "org_visits_insert" on public.visits for insert
  with check (organization_id = (select organization_id from public.profiles where id = auth.uid()));

create policy "org_visits_update" on public.visits for update
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));

create policy "org_visits_delete" on public.visits for delete
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));

create index if not exists idx_visits_org on public.visits(organization_id);
create index if not exists idx_visits_date on public.visits(visit_date);
