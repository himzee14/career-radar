# Setup guide (no coding required)

This walks through getting Career Radar live: one repository, one database,
one deployment. All three services below have free tiers that are more
than enough for a personal tool. Total time: 15-20 minutes.

There's no login screen — this build is meant for a single user, and the
trade-off is that anyone with your Vercel URL can view and edit your data.
Don't share the link publicly.

You'll create three accounts, in this order: **GitHub** (holds the code),
**Supabase** (the database), **Vercel** (runs the website).

---

## 1. Put the code on GitHub (via VS Code)

1. Go to [github.com](https://github.com) and sign up if you don't have an
   account.
2. If you don't already have Git installed, get it from
   [git-scm.com/downloads](https://git-scm.com/downloads) — accept the
   defaults during install. (Check first: open a terminal and run
   `git --version`; if it prints a version, you already have it.)
3. Unzip `career-radar.zip` somewhere on your computer.
4. In VS Code: **File > Open Folder...** and select the unzipped
   `career-radar` folder.
5. Open the **Source Control** panel on the left (the icon that looks like
   branching lines, or `Ctrl+Shift+G` / `Cmd+Shift+G`).
6. Click **Initialize Repository**. VS Code runs `git init` for you.
7. You'll see every file listed under "Changes." Hover over "Changes" and
   click the **+** to stage all of them (or click the checkmark at the top
   and confirm "stage all and commit" when prompted).
8. Type a commit message, e.g. `Initial commit`, and click the checkmark
   (or `Ctrl+Enter`) to commit.
9. Click **Publish Branch** at the bottom of the Source Control panel. The
   first time, VS Code will open your browser to sign in to GitHub and ask
   permission — approve it. Choose **Publish to GitHub private repository**.

VS Code creates the GitHub repo and pushes your first commit in one step —
no `git remote add` or `git push` needed. Your code is now on GitHub,
privately, with no application secrets in it (`.gitignore` keeps
`.env.local` out, and you haven't created that file yet anyway).

**Prefer the terminal?** Same result, from VS Code's integrated terminal
(``Ctrl+` ``):
```bash
git init
git add .
git commit -m "Initial commit"
```
Then create an empty repository at github.com/new (don't add a README —
you already have code to push), copy the URL it gives you, and run:
```bash
git remote add origin https://github.com/<your-username>/career-radar.git
git branch -M main
git push -u origin main
```

**Going forward:** any time you (or an AI-assisted edit) change a file in
VS Code, the Source Control panel will show it under "Changes." Stage,
commit, and click **Sync Changes** to push. Once Vercel is connected in
step 3 below, every push to `main` triggers an automatic redeploy — so
shipping a change is just commit → push.

**Prefer to skip local installs entirely?** Create an empty repository at
github.com/new, then on its page use **Add file > Upload files** and drag
in everything from the unzipped `career-radar` folder (your OS's file
picker will include the dotfiles like `.gitignore`, even though some
browsers hide them visually) and commit. Then open
[github.dev](https://github.dev) with that repo's URL (swap `github.com`
for `github.dev`) for a full VS Code editor running in the browser, backed
directly by the GitHub repo — no Git install required. It's the same
editor, just without an integrated terminal.

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
   - **service_role** key, under "Project API keys" — click **Reveal** to
     see it. This key is powerful (it bypasses all database security), so
     never share it or paste it anywhere except Vercel's environment
     variables in the next step.

## 3. Deploy the website on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up using your GitHub
   account — this makes the next step one click.
2. Click **Add New > Project**. Find and **Import** your `career-radar`
   repository.
3. Before clicking Deploy, expand **Environment Variables** and add two:
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | the Project URL from step 2.5 |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from step 2.5 |
4. Click **Deploy**. Wait about a minute. When it finishes, click **Visit**
   — your dashboard loads directly, no sign-in required.

That's it — there's no separate auth-setup step, because there's no auth.
Skip straight to trying your first import below.

## 4. Try the first import

1. Open `IMPORT_PROMPT.md` from the project folder.
2. Paste that prompt into a new Claude or ChatGPT conversation (with web
   search turned on).
3. Copy the JSON it gives you back.
4. In Career Radar, go to **Import jobs**, paste the JSON, click **Import**.
5. Check **New jobs** — your results should be there, sorted by fit score.
6. Visit **Settings** — you should see the search profile already seeded
   with your role families, locations, and companies from your brief.

From here on, that's the loop: run a discovery pass whenever you want fresh
results, paste the JSON in, review what shows up.

---

## Troubleshooting

- **Dashboard shows nothing after deploying**: double-check the two Vercel
  environment variables are named exactly `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY`, with no typos, and that you used the
  **service_role** key, not the anon key. After changing environment
  variables in Vercel, you need to redeploy for them to take effect
  (Deployments tab > ⋯ menu on the latest one > Redeploy).
- **Import says a job is invalid**: the error message names which field is
  missing — `title`, `company`, `source_name`, and `source_url` are the only
  required ones.
- **A page errors instead of loading**: check the Vercel deployment's
  "Functions" or "Logs" tab for the actual error message — it's usually a
  missing or mistyped environment variable.
