import { STATUS_LABEL, type JobStatus } from "@/lib/types";
import clsx from "clsx";

const STATUS_STYLE: Record<JobStatus, string> = {
  new: "bg-accent-tint text-accent-dark",
  reviewing: "bg-gold-tint text-ink-900",
  shortlisted: "bg-moss-tint text-moss",
  applied: "bg-accent text-white",
  interview: "bg-gold text-white",
  offer: "bg-moss text-white",
  rejected: "bg-brick-tint text-brick",
  dismissed: "bg-line text-ink-500",
  expired: "bg-line text-ink-300",
};

export function StatusPill({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        STATUS_STYLE[status],
        className
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
