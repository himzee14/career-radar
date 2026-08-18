import type { Job } from "@/lib/types";
import { formatLocation, formatRelativeDate, formatSalary } from "@/lib/format";
import { FitScoreBadge } from "./FitScoreBadge";
import { StatusPill } from "./StatusPill";
import { CompanyBadge } from "./CompanyBadge";

export function JobCard({ job, onOpen }: { job: Job; onOpen: () => void }) {
  const displayScore = job.score_override ?? job.fit_score;

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-surface border border-line rounded-xl p-4 shadow-card hover:border-accent/40 transition-colors flex items-center gap-4"
    >
      <FitScoreBadge score={displayScore} category={job.fit_category} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <CompanyBadge company={job.company} fallbackName={job.company_name_raw} />
        </div>
        <h3 className="text-[15px] font-medium text-ink-900 truncate">{job.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink-500">
          <span>{formatLocation(job)}</span>
          <span>&middot;</span>
          <span>{job.source_name}</span>
          <span>&middot;</span>
          <span>Discovered {formatRelativeDate(job.date_discovered)}</span>
          <span>&middot;</span>
          <span className="font-mono">{formatSalary(job)}</span>
        </div>
      </div>

      <StatusPill status={job.status} className="shrink-0" />
    </button>
  );
}
