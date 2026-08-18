import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobStatus } from "./types";

export interface JobFilters {
  status?: JobStatus | JobStatus[];
  location?: string; // matches city or country, case-insensitive
  minScore?: number;
  company?: string;
  source?: string;
  postedWithinDays?: number;
  targetCompanyOnly?: boolean;
  includeDuplicates?: boolean;
}

const JOB_SELECT = `
  id, external_id, title, title_normalized, company_id, company_name_raw,
  location_city, location_country, work_mode, employment_type, seniority,
  description, source_name, source_url, official_company_url, date_posted,
  date_discovered, salary_min, salary_max, salary_currency, salary_type,
  fit_score, fit_category, score_breakdown, strengths, gaps, fit_reason,
  score_override, override_reason, status, notes, canonical_job_id,
  content_hash, created_at, updated_at,
  company:companies ( id, name, aliases, company_type, country, quality_tier, is_target_company, notes )
`;

export async function getJobs(supabase: SupabaseClient, filters: JobFilters = {}) {
  let query = supabase.from("jobs").select(JOB_SELECT);

  if (!filters.includeDuplicates) {
    query = query.is("canonical_job_id", null);
  }

  if (filters.status) {
    query = Array.isArray(filters.status)
      ? query.in("status", filters.status)
      : query.eq("status", filters.status);
  }

  if (filters.location) {
    query = query.or(
      `location_city.ilike.%${filters.location}%,location_country.ilike.%${filters.location}%`
    );
  }

  if (filters.minScore) {
    query = query.gte("fit_score", filters.minScore);
  }

  if (filters.company) {
    query = query.ilike("company_name_raw", `%${filters.company}%`);
  }

  if (filters.source) {
    query = query.ilike("source_name", `%${filters.source}%`);
  }

  if (filters.postedWithinDays) {
    const since = new Date(Date.now() - filters.postedWithinDays * 86_400_000).toISOString();
    query = query.gte("date_discovered", since);
  }

  if (filters.targetCompanyOnly) {
    query = query.eq("company.is_target_company", true);
  }

  const { data, error } = await query
    .order("fit_score", { ascending: false, nullsFirst: false })
    .order("date_discovered", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface DashboardCounts {
  new: number;
  reviewing: number;
  shortlisted: number;
  applied: number;
  interview: number;
  offer: number;
  strongMatches: number;
}

export async function getDashboardCounts(supabase: SupabaseClient): Promise<DashboardCounts> {
  const statuses = ["new", "reviewing", "shortlisted", "applied", "interview", "offer"] as const;
  const counts: Record<string, number> = {};

  await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", status)
        .is("canonical_job_id", null);
      counts[status] = count ?? 0;
    })
  );

  const { count: strongMatches } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .gte("fit_score", 80)
    .is("canonical_job_id", null);

  return {
    new: counts.new ?? 0,
    reviewing: counts.reviewing ?? 0,
    shortlisted: counts.shortlisted ?? 0,
    applied: counts.applied ?? 0,
    interview: counts.interview ?? 0,
    offer: counts.offer ?? 0,
    strongMatches: strongMatches ?? 0,
  };
}
