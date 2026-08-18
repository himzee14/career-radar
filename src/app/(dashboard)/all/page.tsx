import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getJobs, type JobFilters } from "@/lib/queries";
import { JobList } from "@/components/JobList";
import { FilterBar } from "@/components/FilterBar";
import type { Job, JobStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AllJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = createClient();

  const filters: JobFilters = {
    location: params.location,
    company: params.company,
    status: params.status ? (params.status as JobStatus) : undefined,
    minScore: params.minScore ? Number(params.minScore) : undefined,
    postedWithinDays: params.postedWithin ? Number(params.postedWithin) : undefined,
    targetCompanyOnly: params.targetOnly === "1",
    includeDuplicates: false,
  };

  const jobs = await getJobs(supabase, filters);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">All jobs</h1>
        <p className="text-sm text-ink-500 mt-1">{jobs.length} matching your filters.</p>
      </div>
      <Suspense fallback={<div className="h-20" />}>
        <FilterBar />
      </Suspense>
      <JobList jobs={jobs as unknown as Job[]} emptyMessage="No jobs match these filters." />
    </div>
  );
}
