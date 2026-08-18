# Career Radar

A private job intelligence dashboard: discover roles, score them against your
profile, shortlist, and track your pipeline through to offer. It never
applies on your behalf — every "View job" link opens the original posting in
your browser for you to log in and apply manually.

If you're not a developer, skip straight to **SETUP.md** — it's a
click-by-click guide to getting this live with no coding required.

## How it works

```
Job sources (career pages, job boards, an LLM search pass)
        v
   Import page — paste JSON or a single job URL
        v
   Validate + deduplicate
        v
   Supabase (Postgres, row-level security)
        v
   Dashboard (Next.js, deployed on Vercel)
        v
   You — review, shortlist, and apply manually on the source site
```

Fit scores are **not** computed by the app with keyword matching. They're
submitted as part of the import payload by whichever LLM ran the discovery
pass (Claude, ChatGPT, or a future search integration), using the weighted
rubric in your search profile. The app stores, displays, filters, and sorts
by that score — and lets you override it if you disagree. See
`src/lib/importSchema.ts` for the exact payload shape, and
`IMPORT_PROMPT.md` for a copy-paste prompt template that asks an LLM to
produce it.

## Security, by design

- No job-board credentials (LinkedIn, Naukri, Indeed, Workday, etc.) are
  ever stored anywhere — not in the database, not in environment variables,
  not in the frontend.
- The app never auto-applies, auto-submits forms, messages recruiters, or
  scrapes an authenticated session. "View job" always opens the original
  URL in a new tab; you apply yourself.
- There is no Supabase **service role** key anywhere in this codebase.
  Every request goes through the anon key and is enforced by Postgres Row
  Level Security policies scoped to a single owner (`supabase/schema.sql`).
- The dashboard sits behind Supabase magic-link email authentication —
  there's no password to leak.

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres +
Auth) · deployed on Vercel.

## Project structure

```
src/
  app/
    login/                   magic-link sign-in
    auth/callback/            session exchange
    (dashboard)/              everything behind auth
      page.tsx                 dashboard
      new/ shortlisted/ applied/ interviews/ all/   pipeline views
      companies/                company directory
      settings/                 search profile editor
      import/                   JSON / URL import
    api/jobs/
      import/                   ingestion + dedup
      [id]/status/               pipeline status updates
      [id]/note/                 notes
  components/                    JobCard, FitScoreBadge, JobDetailDrawer, ...
  lib/
    types.ts                     shared types
    importSchema.ts               zod validation for imported jobs
    dedup.ts                      title/company normalization, content hash
    queries.ts                    Supabase query builder with filters
    format.ts                     salary/date/location formatting
    supabase/                     client, server, and middleware helpers
supabase/schema.sql               full schema, RLS policies, seed profile
```

## Running locally (optional — only if you want to make code changes)

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

## What V1 deliberately does not do

- No automated scraping of job boards — sources feed in via manual JSON or
  URL paste, kept intentionally simple so nothing breaks against a site's
  terms of service.
- No auto-apply or recruiter messaging of any kind.
- No storage of job-board credentials.

These can be revisited later without changing the database schema — see
`sources` and the `source_name` field, which already support any number of
future ingestion methods.
