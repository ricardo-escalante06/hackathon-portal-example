-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- One organizer per application. No RLS changes needed — organizers can
-- already read/update every application (applications_select_as_organizer,
-- applications_update_as_organizer via is_organizer()), so assignment is
-- purely a filter/queue view, not an access boundary.

alter table public.applications
  add column assigned_to uuid references public.profiles (id) on delete set null;

create index applications_assigned_to_idx on public.applications (assigned_to);
