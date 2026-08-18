# Migrating an existing setup off the login system

You already ran the original `supabase/schema.sql` (with `app_owner` and
login-based policies) and deployed once. Since we've since dropped the
login screen, three things need to change on your existing setup — nothing
needs to be recreated from scratch.

## 1. Update the database

In Supabase: **SQL Editor > New query**, paste and run:

```sql
drop policy if exists "owner full access" on companies;
drop policy if exists "owner full access" on sources;
drop policy if exists "owner full access" on jobs;
drop policy if exists "owner full access" on search_profiles;
drop policy if exists "owner full access" on job_history;
drop policy if exists "no api access" on app_owner;

drop function if exists is_owner();
drop table if exists app_owner;
```

Nothing else in the database needs to change — your jobs, companies, and
search profile are untouched. Row Level Security stays enabled on every
table; it just has no policies now, which means the anon key gets no
access at all, while the service role key (next step) bypasses RLS by
design.

## 2. Get your service role key

In Supabase: **Project Settings > API**, under "Project API keys," find
**service_role** and click **Reveal**. Copy it — treat it like a password,
never share it or paste it anywhere except Vercel's environment variables.

## 3. Update Vercel's environment variables

In Vercel: your project > **Settings > Environment Variables**.

1. Delete `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Add `SUPABASE_URL` — same Project URL value as before.
3. Add `SUPABASE_SERVICE_ROLE_KEY` — the value from step 2.
4. Go to the **Deployments** tab, open the ⋯ menu on the latest deployment,
   and click **Redeploy** (environment variable changes don't apply
   automatically to old deployments).

## 4. Push the updated code

Once you've pulled or received the updated project files, from VS Code's
Source Control panel: stage, commit, and **Sync Changes** (or `git push`
from the terminal) as before. This pushes the code that removes the
login page and switches to the service-role client — Vercel will pick it
up and redeploy automatically (in addition to the manual redeploy in step 3,
which you need once regardless, to pick up the new environment variables).

## 5. Verify

Visit your Vercel URL. It should load straight into the dashboard — no
sign-in page, no redirect. **Settings** should show your seeded search
profile untouched.
