import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/lib/queries";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AppliedPage() {
  const supabase = createClient();
  const jobs = await getJobs(supabase, { status: "applied" });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Applied</h1>
        <p className="text-sm text-ink-500 mt-1">{jobs.length} applications in flight.</p>
      </div>
      <JobList jobs={jobs as unknown as Job[]} emptyMessage="Nothing marked applied yet." />
    </div>
  );
}
