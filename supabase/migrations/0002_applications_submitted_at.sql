-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Distinguishes "picked an applicant type, application row exists" from
-- "actually submitted the form" — null means still a draft.

alter table public.applications
  add column submitted_at timestamptz;
