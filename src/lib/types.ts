export type JobStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "dismissed"
  | "expired";

export const JOB_STATUSES: JobStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "applied",
  "interview",
  "offer",
  "rejected",
  "dismissed",
  "expired",
];

export type WorkMode = "remote" | "hybrid" | "onsite" | "unknown";

export type SalaryType = "published" | "estimated" | "not_disclosed";

export type FitCategory =
  | "exceptional"
  | "strong"
  | "worth_considering"
  | "stretch"
  | "usually_skip";

export interface ScoreBreakdown {
  role_alignment: number; // out of 25
  leadership_fit: number; // out of 20
  technical_fit: number; // out of 20
  company_quality: number; // out of 15
  location: number; // out of 10
  compensation: number; // out of 10
}

export interface Company {
  id: string;
  name: string;
  aliases: string[] | null;
  company_type: string | null;
  country: string | null;
  quality_tier: "tier1_global" | "tier2_regional" | "tier3_local" | "unknown" | null;
  is_target_company: boolean;
  notes: string | null;
}

export interface JobNote {
  at: string; // ISO timestamp
  text: string;
}

export interface Job {
  id: string;
  external_id: string | null;
  title: string;
  title_normalized: string;
  company_id: string | null;
  company_name_raw: string; // denormalized, always present even before company match
  location_city: string | null;
  location_country: string | null;
  work_mode: WorkMode;
  employment_type: string | null;
  seniority: string | null;
  description: string | null;
  source_name: string;
  source_url: string;
  official_company_url: string | null;
  date_posted: string | null; // ISO date
  date_discovered: string; // ISO timestamp
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_type: SalaryType;
  fit_score: number | null; // 0-100, submitted by the search/LLM pass
  fit_category: FitCategory | null;
  score_breakdown: ScoreBreakdown | null;
  strengths: string[] | null;
  gaps: string[] | null;
  fit_reason: string | null;
  score_override: number | null;
  override_reason: string | null;
  status: JobStatus;
  notes: JobNote[] | null;
  canonical_job_id: string | null;
  content_hash: string;
  created_at: string;
  updated_at: string;
  company?: Company | null;
}

export interface SearchProfile {
  id: string;
  profile_name: string;
  locations: string[];
  role_families: string[];
  avoid_terms: string[];
  must_have_skills: string[];
  nice_to_have_skills: string[];
  salary_preferences: {
    min?: number;
    currency?: string;
    hard_floor?: boolean;
  } | null;
  company_preferences: {
    preferred: string[];
    avoid: string[];
  } | null;
  scoring_weights: {
    role_alignment: number;
    leadership_fit: number;
    technical_fit: number;
    company_quality: number;
    location: number;
    compensation: number;
  };
}

export const FIT_CATEGORY_LABEL: Record<FitCategory, string> = {
  exceptional: "Exceptional match",
  strong: "Strong match",
  worth_considering: "Worth considering",
  stretch: "Stretch",
  usually_skip: "Usually skip",
};

export function fitCategoryFromScore(score: number): FitCategory {
  if (score >= 90) return "exceptional";
  if (score >= 80) return "strong";
  if (score >= 70) return "worth_considering";
  if (score >= 60) return "stretch";
  return "usually_skip";
}

export const STATUS_LABEL: Record<JobStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  dismissed: "Dismissed",
  expired: "Expired",
};
