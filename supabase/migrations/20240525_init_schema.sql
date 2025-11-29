-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  primary key (id)
);

alter table public.profiles enable row level security;

-- Trigger to create profile on new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors on re-runs
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Events Table
create table if not exists public.events (
  id uuid not null default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  title text not null,
  slug text not null unique,
  event_date date,
  cover_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  primary key (id)
);

alter table public.events enable row level security;

-- 3. Media Table
create table if not exists public.media (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  storage_path text not null,
  url text not null,
  type text check (type in ('image', 'video')),
  status text default 'pending',
  title text,
  created_at timestamptz default now(),
  primary key (id)
);

alter table public.media enable row level security;

-- 4. RLS Policies

-- Profiles: Everyone can read, User can update own
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Events: Everyone can read, Only owner can insert/update/delete
create policy "Events are viewable by everyone."
  on public.events for select
  using ( true );

create policy "Users can insert their own events."
  on public.events for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update their own events."
  on public.events for update
  using ( auth.uid() = owner_id );

create policy "Users can delete their own events."
  on public.events for delete
  using ( auth.uid() = owner_id );

-- Media: Everyone can insert (public upload), Everyone can read approved
create policy "Media is viewable by everyone if approved or owner."
  on public.media for select
  using ( 
    status = 'approved' 
    or 
    exists ( select 1 from public.events where id = media.event_id and owner_id = auth.uid() )
  );

create policy "Everyone can upload media."
  on public.media for insert
  with check ( true );

create policy "Event owners can update media status."
  on public.media for update
  using ( exists ( select 1 from public.events where id = media.event_id and owner_id = auth.uid() ) );

create policy "Event owners can delete media."
  on public.media for delete
  using ( exists ( select 1 from public.events where id = media.event_id and owner_id = auth.uid() ) );
