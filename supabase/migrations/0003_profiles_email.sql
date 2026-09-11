-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Organizers need the applicant's email to review/contact them. Denormalized
-- onto profiles (set once at role selection) rather than querying auth.users
-- directly, since the app's client only has RLS-scoped access to public.*.

alter table public.profiles add column email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;
