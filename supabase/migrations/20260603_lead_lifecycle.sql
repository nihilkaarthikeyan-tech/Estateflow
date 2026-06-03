-- ============================================================
-- Lead lifecycle columns
--   closed_at               — set automatically when a lead is marked 'closed'
--                             (drives Workflow 09 — Post-Sale Referral Follow-up)
--   referral_followup_sent_at — guards against duplicate referral asks
--   golden_visa             — flag for AED 2M+ buyers (Golden Visa pipeline)
-- ============================================================

alter table public.leads
  add column if not exists closed_at                  timestamp with time zone,
  add column if not exists referral_followup_sent_at  timestamp with time zone,
  add column if not exists golden_visa                boolean default false;

-- Stamp closed_at the moment a lead transitions into the 'closed' stage,
-- and clear it if it ever moves back out.
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

-- Backfill closed_at for any leads already sitting in 'closed'
update public.leads
  set closed_at = coalesce(closed_at, updated_at)
  where status = 'closed' and closed_at is null;

create index if not exists idx_leads_closed_at on public.leads(closed_at);
create index if not exists idx_leads_golden_visa on public.leads(golden_visa) where golden_visa = true;
