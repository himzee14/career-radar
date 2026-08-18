import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/lib/queries";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewJobsPage() {
  const supabase = await createClient();
  const jobs = await getJobs(supabase, { status: "new" });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">New jobs</h1>
        <p className="text-sm text-ink-500 mt-1">{jobs.length} awaiting review, sorted by fit score.</p>
      </div>
      <JobList jobs={jobs as unknown as Job[]} emptyMessage="No new jobs. Head to Import to add some." />
    </div>
  );
}
