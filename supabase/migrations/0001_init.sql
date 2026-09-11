-- Already applied to the live project (initial auth/profiles/applications
-- schema + RLS). Kept as history; don't re-run. New changes go in the next
-- numbered migration file — run each once in the Supabase SQL Editor until
-- the CLI is linked.

create type user_role as enum ('applicant', 'organizer');
create type applicant_type as enum ('hacker', 'judge', 'mentor', 'volunteer');
create type application_status as enum ('pending', 'accepted', 'rejected', 'waitlisted');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  role user_role,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  applicant_type applicant_type not null,
  status application_status not null default 'pending',
  responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit (used to show organizers what
-- changed since they last reviewed).
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
  before update on public.applications
  for each row
  execute function public.set_updated_at();

-- Security-definer helper so RLS policies can check "is this caller an
-- organizer?" without recursively querying profiles under its own RLS.
create function public.is_organizer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'organizer'
  );
$$;

alter table public.profiles enable row level security;
alter table public.applications enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_as_organizer" on public.profiles
  for select using (public.is_organizer());

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "applications_select_own" on public.applications
  for select using (auth.uid() = user_id);

create policy "applications_select_as_organizer" on public.applications
  for select using (public.is_organizer());

create policy "applications_insert_own" on public.applications
  for insert with check (auth.uid() = user_id);

create policy "applications_update_own_while_pending" on public.applications
  for update using (auth.uid() = user_id and status = 'pending');

create policy "applications_update_as_organizer" on public.applications
  for update using (public.is_organizer());
