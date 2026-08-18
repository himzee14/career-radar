import { z } from "zod";

const scoreBreakdownSchema = z.object({
  role_alignment: z.number().min(0).max(25),
  leadership_fit: z.number().min(0).max(20),
  technical_fit: z.number().min(0).max(20),
  company_quality: z.number().min(0).max(15),
  location: z.number().min(0).max(10),
  compensation: z.number().min(0).max(10),
});

export const importJobSchema = z.object({
  external_id: z.string().trim().optional().nullable(),
  title: z.string().trim().min(1, "title is required"),
  company: z.string().trim().min(1, "company is required"),
  location_city: z.string().trim().optional().nullable(),
  location_country: z.string().trim().optional().nullable(),
  work_mode: z.enum(["remote", "hybrid", "onsite", "unknown"]).optional().default("unknown"),
  employment_type: z.string().trim().optional().nullable(),
  seniority: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  source_name: z.string().trim().min(1, "source_name is required"),
  source_url: z.string().trim().url("source_url must be a valid URL"),
  official_company_url: z.string().trim().url().optional().nullable(),
  date_posted: z.string().trim().optional().nullable(),
  salary: z
    .object({
      min: z.number().nonnegative().optional().nullable(),
      max: z.number().nonnegative().optional().nullable(),
      currency: z.string().trim().optional().nullable(),
      type: z.enum(["published", "estimated", "not_disclosed"]).default("not_disclosed"),
    })
    .optional()
    .nullable(),
  fit_score: z.number().min(0).max(100).optional().nullable(),
  score_breakdown: scoreBreakdownSchema.optional().nullable(),
  strengths: z.array(z.string()).optional().nullable(),
  gaps: z.array(z.string()).optional().nullable(),
  fit_reason: z.string().trim().optional().nullable(),
});

export type ImportJobInput = z.infer<typeof importJobSchema>;

/**
 * Pulls the list of raw (unvalidated) job items out of whatever shape was
 * pasted in: a single object, a bare array, or { jobs: [...] }. Field-level
 * validation happens per item in the route handler so one bad item doesn't
 * sink the whole batch.
 */
export function extractRawItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "jobs" in payload) {
    const jobs = (payload as { jobs: unknown }).jobs;
    if (Array.isArray(jobs)) return jobs;
    throw new Error("`jobs` must be an array");
  }
  if (payload && typeof payload === "object") return [payload];
  throw new Error("Expected a job object, an array of jobs, or { jobs: [...] }");
}
