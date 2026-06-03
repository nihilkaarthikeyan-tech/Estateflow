-- ============================================================
-- Off-Plan Payment Schedules (Workflow 06 — Off-Plan Payment Reminder)
-- Developers / agents track off-plan installment milestones here.
-- n8n reads this daily and WhatsApps the buyer 7 days before each due date.
-- ============================================================

create table if not exists public.payment_schedules (
  id                uuid primary key default uuid_generate_v4(),
  property_id       uuid references public.properties(id) on delete set null,
  lead_id           uuid references public.leads(id) on delete set null,
  -- Buyer contact (denormalised so reminders work even without a linked lead)
  buyer_name        text not null,
  buyer_phone       text not null,
  -- Off-plan project details
  project_name      text not null,            -- e.g. "Emaar Creek Harbour"
  developer         text,                     -- e.g. "Emaar Properties"
  installment_label text,                     -- e.g. "Installment 3 of 8"
  amount            numeric not null,         -- AED amount of this installment
  due_date          date not null,
  bank_details      text,                     -- IBAN / account info shown in the reminder
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'overdue')),
  reminder_sent_at  timestamp with time zone, -- guards against duplicate sends
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now()
);

-- Auto-update updated_at (re-uses the shared handle_updated_at() trigger fn)
drop trigger if exists set_updated_at_payment_schedules on public.payment_schedules;
create trigger set_updated_at_payment_schedules
  before update on public.payment_schedules
  for each row execute procedure public.handle_updated_at();

alter table public.payment_schedules enable row level security;

create policy "Authenticated users can manage payment schedules"
  on public.payment_schedules for all
  using (auth.uid() is not null);

create index if not exists idx_payment_schedules_due on public.payment_schedules(due_date);
create index if not exists idx_payment_schedules_status on public.payment_schedules(status);
create index if not exists idx_payment_schedules_property on public.payment_schedules(property_id);
