create table public.leads (
  id uuid not null default gen_random_uuid (),
  event_id bigint not null references public.events (id) on delete cascade,
  email text not null,
  is_planning_event boolean default false,
  created_at timestamp with time zone not null default now(),
  constraint leads_pkey primary key (id)
);

-- Enable RLS
alter table public.leads enable row level security;

-- Allow anonymous inserts (for guests)
create policy "Allow anonymous inserts" on public.leads
  for insert
  to anon
  with check (true);

-- Allow authenticated users (admins) to view leads
create policy "Allow authenticated view" on public.leads
  for select
  to authenticated
  using (true);
