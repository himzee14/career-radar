import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/lib/queries";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ShortlistedPage() {
  const supabase = createClient();
  const jobs = await getJobs(supabase, { status: "shortlisted" });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Shortlisted</h1>
        <p className="text-sm text-ink-500 mt-1">{jobs.length} jobs ready for you to apply to.</p>
      </div>
      <JobList jobs={jobs as unknown as Job[]} emptyMessage="Nothing shortlisted yet." />
    </div>
  );
}
