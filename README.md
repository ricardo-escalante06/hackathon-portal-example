# Cal Hacks Portal

A miniature hackathon application portal: applicants sign in, pick a role
(hacker, judge, mentor, or volunteer), and submit a type-specific
application; organizers review, grade, assign, and track everyone in one
dashboard.

**Live:** _add your deployed Vercel URL here_

## Features

**Applicants**
- Sign in with Google (Supabase Auth)
- Pick a role, fill out a type-specific application form (server-validated
  with Zod), and submit
- See a confirmation screen with their current status once submitted

**Organizers**
- A single dashboard listing every application, with live pending/completed/
  unassigned counters
- Filters by type, status, and assignee (including a searchable "find one
  organizer" mode that doesn't require listing everyone) — all filters
  apply instantly, no submit button
- A review modal showing the full application, with Accept / Waitlist /
  Reject / Reset-to-pending actions that auto-advance to the next pending
  application in the current view
- Assign applications to a specific organizer, or auto-distribute all
  unassigned applications round-robin

**Everywhere**
- Light/dark theme toggle (persisted, no flash on load)
- Loading and pending states on every async action

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- [Supabase](https://supabase.com) — Postgres, Auth (Google OAuth), Row
  Level Security
- TypeScript, Tailwind CSS v4
- [Zod](https://zod.dev) for form validation
- Deployed on [Vercel](https://vercel.com)

## Architecture

**Data model** (`supabase/migrations/`, applied in order):
- `profiles` — one row per authenticated user (`id` = `auth.users.id`),
  holds `role` (`applicant` | `organizer`), name, and email
- `applications` — one row per applicant, holding `applicant_type`,
  `status`, `assigned_to` (an organizer), `submitted_at`, and a `responses`
  jsonb column. Per-type fields (see `src/lib/application-fields.ts`) live
  in that jsonb column rather than one column per field — each applicant
  type has a different question set, and adding/editing a question is a
  one-line change instead of a migration.

**Authorization** is enforced by Postgres Row Level Security, not just
UI checks: applicants can only read/write their own row; organizers can
read/write every row, via an `is_organizer()` SQL function (a
`security definer` helper, to avoid recursive RLS on the `profiles` table
itself). See `supabase/migrations/0001_init.sql`.

**Data access** goes through `src/lib/dal.ts` — a small Data Access Layer
that centralizes "who is the current user" and "where should they land"
(`resolveDestination`), so the auth callback route and every page agree on
routing without duplicating logic.

**Mutations** are Server Actions (`src/app/actions/`), not API routes —
called directly from `<form action={...}>` where possible, which works
without any client-side JavaScript (filters and the assignment dropdown
are the two places that genuinely need client interactivity: auto-submit-
on-change and optimistic UI can't be done with a plain form).

**Note:** `src/proxy.ts` is this project's session-refresh middleware —
Next.js 16 renamed `middleware.ts` to `proxy.ts`; functionality is the
same as `middleware.ts` in earlier Next.js versions.

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project**, then copy `.env.local.example` to
   `.env.local` and fill in your project's URL and anon key (Supabase
   dashboard → Settings → API).

3. **Run the migrations** in `supabase/migrations/`, in order, via the
   Supabase SQL Editor (paste each file's contents and run it).

4. **Enable Google sign-in**: Supabase dashboard → Authentication →
   Providers → Google, using an OAuth Client ID/Secret from
   [Google Cloud Console](https://console.cloud.google.com) (Authorized
   redirect URI = the callback URL Supabase shows you on that page). Then
   set **Authentication → URL Configuration → Redirect URLs** to include
   `http://localhost:3000/**` (and your deployed URL, once you have one).

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploying

Import the repo on [Vercel](https://vercel.com/new), add the same two
environment variables under Production/Preview/Development, and set the
Production Branch to `main`. Add the deployed URL to Supabase's Redirect
URLs allowlist afterward.
