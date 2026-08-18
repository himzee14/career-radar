# Setup guide (no coding required)

This walks through getting Career Radar live: one repository, one database,
one deployment, one login. All three services below have free tiers that
are more than enough for a personal tool. Total time: 20-30 minutes.

You'll create three accounts, in this order: **GitHub** (holds the code),
**Supabase** (the database), **Vercel** (runs the website).

---

## 1. Put the code on GitHub

1. Go to [github.com](https://github.com) and sign up if you don't have an
   account.
2. Download and install **GitHub Desktop** from
   [desktop.github.com](https://desktop.github.com) — this gives you a
   simple app instead of typing commands. Sign in with your GitHub account
   when it opens.
3. Unzip the `career-radar.zip` file I gave you somewhere on your computer.
4. In GitHub Desktop: **File > Add Local Repository**. Browse to the
   unzipped `career-radar` folder and select it.
5. It will say "this directory does not appear to be a Git repository" —
   click **create a repository** in that same message. Keep the name as
   `career-radar`, tick **Keep this code private**, click **Create
   Repository**.
6. Click **Publish repository** in the top bar. Keep it private. Click
   **Publish**.

Your code is now on GitHub, privately, with no application secrets in it
(the `.gitignore` file keeps your `.env.local` out — you haven't made that
file yet anyway).

## 2. Create the database on Supabase

1. Go to [supabase.com](https://supabase.com) and sign up (using your GitHub
   account is the fastest option).
2. Click **New project**. Name it `career-radar`. Set a database password —
   generate one and save it somewhere safe (a password manager); the app
   itself never uses this password, but Supabase needs it. Pick a region
   close to UAE/India. Click **Create new project** and wait a minute or two
   while it provisions.
3. Once it's ready, open **SQL Editor** in the left sidebar > **New query**.
4. Open `supabase/schema.sql` from the project folder in any text editor,
   copy the entire contents, paste into the SQL Editor, and click **Run**.
   You should see "Success. No rows returned."
5. Go to **Project Settings > API**. You'll need two values from this page
   in the next step — keep this tab open:
   - **Project URL**
   - **anon public** key (a long string)

## 3. Deploy the website on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up using your GitHub
   account — this makes the next step one click.
2. Click **Add New > Project**. Find and **Import** your `career-radar`
   repository.
3. Before clicking Deploy, expand **Environment Variables** and add two:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from step 2.5 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key from step 2.5 |
4. Click **Deploy**. Wait about a minute. When it finishes, click **Visit**
   — copy this URL (something like `https://career-radar-yourname.vercel.app`)
   for the next step.

## 4. Connect Supabase auth to your live URL

1. Back in Supabase: **Authentication > URL Configuration**.
2. Set **Site URL** to your Vercel URL from step 3.4.
3. Under **Redirect URLs**, add `<your-vercel-url>/auth/callback` — for
   example `https://career-radar-yourname.vercel.app/auth/callback`.
4. Save.

## 5. Sign in and claim ownership of your data

1. Visit your Vercel URL. You'll land on a sign-in page — this is expected.
2. Enter your email, click **Send sign-in link**, then check your inbox
   (and spam folder — the first email from a new Supabase project sometimes
   lands there) and click the link.
3. You'll land on the dashboard, but it will look completely empty — also
   expected. The database doesn't yet know your login is the owner, so
   Row Level Security is hiding everything from everyone, including you.
4. In Supabase: **Authentication > Users**. Find your email, click it, and
   copy the **User UID**.
5. Back in **SQL Editor > New query**, run (with your real UID pasted in):
   ```sql
   insert into app_owner (id) values ('paste-your-user-id-here');
   ```
6. Refresh your dashboard. **Settings** should now show the search profile
   already seeded with your role families, locations, and companies from
   your brief.

## 6. Try the first import

1. Open `IMPORT_PROMPT.md` from the project folder.
2. Paste that prompt into a new Claude or ChatGPT conversation (with web
   search turned on).
3. Copy the JSON it gives you back.
4. In Career Radar, go to **Import jobs**, paste the JSON, click **Import**.
5. Check **New jobs** — your results should be there, sorted by fit score.

From here on, that's the loop: run a discovery pass whenever you want fresh
results, paste the JSON in, review what shows up.

---

## Troubleshooting

- **Sign-in email never arrives**: check spam. Supabase's built-in email
  sender is rate-limited (fine for personal use, but if it's ever an issue,
  Authentication > Providers > Email lets you plug in your own SMTP later).
- **Dashboard is empty after signing in, even after step 5**: double-check
  you copied the exact User UID (no extra spaces) and that the SQL ran
  without an error.
- **Redirected back to login in a loop**: usually the Redirect URL in step 4
  doesn't exactly match your Vercel URL (check for a trailing slash
  mismatch or `http` vs `https`).
- **Import says a job is invalid**: the error message names which field is
  missing — `title`, `company`, `source_name`, and `source_url` are the only
  required ones.
