-- Career Radar schema
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Ownership: this app is single-user. Every table's RLS policy checks
-- against the one row in app_owner rather than hardcoding a UUID inline,
-- so you never have to edit policy SQL after signing up.
--
-- AFTER you complete your first magic-link sign-in (see SETUP.md), find
-- your user id in Authentication > Users in the Supabase dashboard, then
-- run, in the SQL Editor:
--   insert into app_owner (id) values ('paste-your-user-id-here');
-- ---------------------------------------------------------------------------
create table app_owner (
  id uuid primary key
);

create or replace function is_owner() returns boolean as $$
  select exists (select 1 from app_owner where id = auth.uid());
$$ language sql security definer stable set search_path = public;

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] default '{}',
  company_type text,
  country text,
  quality_tier text default 'unknown'
    check (quality_tier in ('tier1_global', 'tier2_regional', 'tier3_local', 'unknown')),
  is_target_company boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index companies_name_idx on companies using gin (to_tsvector('simple', name));

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text,
  base_url text,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- jobs
-- ---------------------------------------------------------------------------
create table jobs (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  title text not null,
  title_normalized text not null,
  company_id uuid references companies(id) on delete set null,
  company_name_raw text not null,
  location_city text,
  location_country text,
  work_mode text not null default 'unknown'
    check (work_mode in ('remote', 'hybrid', 'onsite', 'unknown')),
  employment_type text,
  seniority text,
  description text,
  source_name text not null,
  source_url text not null,
  official_company_url text,
  date_posted date,
  date_discovered timestamptz not null default now(),
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  salary_type text not null default 'not_disclosed'
    check (salary_type in ('published', 'estimated', 'not_disclosed')),
  fit_score int check (fit_score between 0 and 100),
  fit_category text
    check (fit_category in ('exceptional', 'strong', 'worth_considering', 'stretch', 'usually_skip')),
  score_breakdown jsonb,
  strengths text[],
  gaps text[],
  fit_reason text,
  score_override int check (score_override between 0 and 100),
  override_reason text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'shortlisted', 'applied', 'interview', 'offer', 'rejected', 'dismissed', 'expired')),
  notes jsonb not null default '[]',
  canonical_job_id uuid references jobs(id) on delete set null,
  content_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_content_hash_idx on jobs (content_hash);
create index jobs_external_source_idx on jobs (source_name, external_id);
create index jobs_status_idx on jobs (status);
create index jobs_fit_score_idx on jobs (fit_score desc nulls last);
create index jobs_date_discovered_idx on jobs (date_discovered desc);

-- ---------------------------------------------------------------------------
-- search_profiles
-- ---------------------------------------------------------------------------
create table search_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_name text not null default 'Primary',
  locations jsonb not null default '[]',
  role_families jsonb not null default '[]',
  avoid_terms jsonb not null default '[]',
  must_have_skills jsonb not null default '[]',
  nice_to_have_skills jsonb not null default '[]',
  salary_preferences jsonb,
  company_preferences jsonb,
  scoring_weights jsonb not null default
    '{"role_alignment":25,"leadership_fit":20,"technical_fit":20,"company_quality":15,"location":10,"compensation":10}'
);

-- ---------------------------------------------------------------------------
-- job_history — populated automatically by trigger, never written by the app
-- ---------------------------------------------------------------------------
create table job_history (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_at timestamptz not null default now()
);

create or replace function log_job_status_change() returns trigger as $$
begin
  if (tg_op = 'UPDATE' and old.status is distinct from new.status) then
    insert into job_history (job_id, previous_status, new_status)
    values (new.id, old.status, new.status);
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_status_history
before update on jobs
for each row execute function log_job_status_change();

-- ---------------------------------------------------------------------------
-- Row Level Security — every table is locked to the single owner
-- ---------------------------------------------------------------------------
alter table app_owner enable row level security;
alter table companies enable row level security;
alter table sources enable row level security;
alter table jobs enable row level security;
alter table search_profiles enable row level security;
alter table job_history enable row level security;

-- app_owner is never readable or writable through the API — only from the
-- Supabase SQL Editor, which connects as an elevated role that bypasses RLS.
create policy "no api access" on app_owner for all using (false);

create policy "owner full access" on companies for all using (is_owner()) with check (is_owner());
create policy "owner full access" on sources for all using (is_owner()) with check (is_owner());
create policy "owner full access" on jobs for all using (is_owner()) with check (is_owner());
create policy "owner full access" on search_profiles for all using (is_owner()) with check (is_owner());
create policy "owner full access" on job_history for all using (is_owner()) with check (is_owner());

-- ---------------------------------------------------------------------------
-- Seed: your primary search profile, pre-filled from your brief
-- ---------------------------------------------------------------------------
insert into search_profiles (
  profile_name, locations, role_families, avoid_terms, must_have_skills, nice_to_have_skills,
  salary_preferences, company_preferences
) values (
  'Primary',
  '["Dubai, UAE", "Abu Dhabi, UAE", "UAE (wider)", "Delhi NCR, India", "Noida, India", "Greater Noida, India", "Gurugram, India"]',
  '["Digital Delivery Manager", "Senior Digital Delivery Manager", "Digital Engineering Manager", "BIM Manager", "BIM & Digital Delivery Manager", "BIM Lead", "Digital Delivery Lead", "Information Manager", "BIM Operations Manager", "BIM/VDC Manager", "Digital Engineering Lead"]',
  '["BIM Modeller", "Revit Modeller", "BIM Coordinator", "Junior Information Manager", "Civil 3D Specialist", "Site Engineer", "Planning Engineer", "Project Planner/Scheduler"]',
  '["ISO 19650", "BIM Execution Plan preparation", "ACC / CDE governance", "Digital Delivery leadership", "multidisciplinary BIM coordination"]',
  '["Reality capture", "Scan-to-BIM", "Digital twins", "process automation", "training and mentoring"]',
  '{"min": null, "currency": "AED", "hard_floor": false}',
  '{"preferred": ["AECOM", "Egis", "WSP", "Arcadis", "AtkinsRealis", "Jacobs", "Mott MacDonald", "Arup", "Bechtel", "Ramboll", "COWI", "GE Vernova", "Gensler", "Stantec", "Parsons", "Turner & Townsend"], "avoid": ["small local developers", "small local contractors", "opaque recruiting companies", "questionable staffing agencies"]}'
);
