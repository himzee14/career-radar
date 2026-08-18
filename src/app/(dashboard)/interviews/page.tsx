import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/lib/queries";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function InterviewsPage() {
  const supabase = createClient();
  const jobs = await getJobs(supabase, { status: ["interview", "offer"] });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Interviews &amp; offers</h1>
        <p className="text-sm text-ink-500 mt-1">{jobs.length} in active conversations.</p>
      </div>
      <JobList jobs={jobs as unknown as Job[]} emptyMessage="No interviews or offers yet." />
    </div>
  );
}
