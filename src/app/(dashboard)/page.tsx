import { createClient } from "@/lib/supabase/server";
import { getDashboardCounts, getJobs } from "@/lib/queries";
import { PipelineStats } from "@/components/PipelineStats";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

function topGroups(jobs: Job[], key: "location_country" | "company_name_raw", limit = 5) {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    const value = (job[key] as string | null) ?? "Unspecified";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export default async function DashboardPage() {
  const supabase = createClient();
  const counts = await getDashboardCounts(supabase);
  const active = await getJobs(supabase, { status: ["new", "reviewing", "shortlisted"] });
  const topMatches = [...active].sort((a, b) => (b.fit_score ?? 0) - (a.fit_score ?? 0)).slice(0, 5);
  const recent = [...active]
    .sort((a, b) => new Date(b.date_discovered).getTime() - new Date(a.date_discovered).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-1">Your pipeline at a glance.</p>
      </div>

      <PipelineStats
        counts={{
          new: counts.new ?? 0,
          strongMatches: counts.strongMatches ?? 0,
          applied: counts.applied ?? 0,
          interview: counts.interview ?? 0,
          offer: counts.offer ?? 0,
        }}
      />

      <section>
        <h2 className="text-[13px] font-medium text-ink-900 mb-3">Top new matches</h2>
        <JobList jobs={topMatches as unknown as Job[]} emptyMessage="No active matches yet — import some jobs to get started." />
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-[13px] font-medium text-ink-900 mb-3">Active jobs by location</h2>
          <ul className="space-y-1.5">
            {topGroups(active as unknown as Job[], "location_country").map(([name, count]) => (
              <li key={name} className="flex justify-between text-sm text-ink-700 border-b border-line pb-1.5">
                <span>{name}</span>
                <span className="font-mono text-ink-500">{count}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-[13px] font-medium text-ink-900 mb-3">Active jobs by company</h2>
          <ul className="space-y-1.5">
            {topGroups(active as unknown as Job[], "company_name_raw").map(([name, count]) => (
              <li key={name} className="flex justify-between text-sm text-ink-700 border-b border-line pb-1.5">
                <span className="truncate">{name}</span>
                <span className="font-mono text-ink-500 shrink-0">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="text-[13px] font-medium text-ink-900 mb-3">Recently discovered</h2>
        <JobList jobs={recent as unknown as Job[]} emptyMessage="Nothing discovered yet." />
      </section>
    </div>
  );
}
