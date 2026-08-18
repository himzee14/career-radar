"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Job, JobStatus } from "@/lib/types";
import { JobCard } from "./JobCard";
import { JobDetailDrawer } from "./JobDetailDrawer";

export function JobList({ jobs, emptyMessage }: { jobs: Job[]; emptyMessage?: string }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = jobs.find((j) => j.id === selectedId) ?? null;

  async function handleStatusChange(status: JobStatus) {
    if (!selected) return;
    await fetch(`/api/jobs/${selected.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleAddNote(text: string) {
    if (!selected) return;
    await fetch(`/api/jobs/${selected.id}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    router.refresh();
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center text-sm text-ink-500">
        {emptyMessage ?? "No jobs here yet."}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onOpen={() => setSelectedId(job.id)} />
        ))}
      </div>
      {selected && (
        <JobDetailDrawer
          job={selected}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
        />
      )}
    </>
  );
}
