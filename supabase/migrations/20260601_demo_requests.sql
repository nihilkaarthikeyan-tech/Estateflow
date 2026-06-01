create table if not exists demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  agency text,
  message text,
  created_at timestamptz default now()
);

alter table demo_requests enable row level security;

-- Only service role can insert/read (called from API route with service key)
create policy "service_role_only" on demo_requests
  using (false)
  with check (false);
