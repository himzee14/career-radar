"use client";

import { useState } from "react";
import type { Job, JobStatus } from "@/lib/types";
import { formatLocation, formatRelativeDate, formatSalary } from "@/lib/format";
import { FitScoreBadge } from "./FitScoreBadge";
import { StatusPill } from "./StatusPill";

const BREAKDOWN_LABELS: { key: keyof NonNullable<Job["score_breakdown"]>; label: string; max: number }[] = [
  { key: "role_alignment", label: "Role & career alignment", max: 25 },
  { key: "leadership_fit", label: "Leadership / seniority fit", max: 20 },
  { key: "technical_fit", label: "BIM & digital delivery fit", max: 20 },
  { key: "company_quality", label: "Company quality", max: 15 },
  { key: "location", label: "Location", max: 10 },
  { key: "compensation", label: "Compensation", max: 10 },
];

export function JobDetailDrawer({
  job,
  onClose,
  onStatusChange,
  onAddNote,
}: {
  job: Job;
  onClose: () => void;
  onStatusChange: (status: JobStatus) => void;
  onAddNote: (text: string) => void;
}) {
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const displayScore = job.score_override ?? job.fit_score;

  async function submitNote() {
    if (!noteDraft.trim()) return;
    setSavingNote(true);
    await onAddNote(noteDraft.trim());
    setNoteDraft("");
    setSavingNote(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-paper h-full overflow-y-auto border-l border-line p-6">
        <button onClick={onClose} className="text-ink-500 text-sm mb-4" aria-label="Close">
          Close
        </button>

        <div className="flex items-start gap-4 mb-4">
          <FitScoreBadge score={displayScore} category={job.fit_category} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink-500">{job.company?.name ?? job.company_name_raw}</p>
            <h2 className="text-xl font-medium text-ink-900">{job.title}</h2>
            <p className="text-[13px] text-ink-500 mt-1">
              {formatLocation(job)} &middot; {job.seniority ?? "Seniority unspecified"} &middot;{" "}
              {job.employment_type ?? "Type unspecified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <StatusPill status={job.status} />
          <span className="text-[12px] text-ink-500">
            Posted {job.date_posted ? formatRelativeDate(job.date_posted) : "date unknown"} &middot; discovered{" "}
            {formatRelativeDate(job.date_discovered)} via {job.source_name}
          </span>
        </div>

        <a
          href={job.official_company_url ?? job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          View job &amp; apply on source site
        </a>

        <section className="mb-6">
          <h3 className="text-[13px] font-medium text-ink-900 mb-2">Salary</h3>
          <p className="text-sm font-mono text-ink-900">{formatSalary(job)}</p>
        </section>

        {job.fit_reason && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-ink-900 mb-2">Why it matches</h3>
            <p className="text-sm text-ink-700 leading-relaxed">{job.fit_reason}</p>
          </section>
        )}

        {job.score_breakdown && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-ink-900 mb-3">Score breakdown</h3>
            <div className="space-y-2">
              {BREAKDOWN_LABELS.map(({ key, label, max }) => {
                const value = job.score_breakdown?.[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-40 text-[12px] text-ink-500 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(value / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[12px] font-mono text-ink-700">
                      {value}/{max}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {job.strengths && job.strengths.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-moss mb-2">Top strengths</h3>
            <ul className="text-sm text-ink-700 space-y-1 list-disc list-inside">
              {job.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {job.gaps && job.gaps.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-gold mb-2">Main gaps</h3>
            <ul className="text-sm text-ink-700 space-y-1 list-disc list-inside">
              {job.gaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </section>
        )}

        {job.description && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-ink-900 mb-2">Description</h3>
            <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>
        )}

        {job.notes && job.notes.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[13px] font-medium text-ink-900 mb-2">Your notes</h3>
            <ul className="space-y-2">
              {job.notes.map((n, i) => (
                <li key={i} className="text-sm text-ink-700 border-l-2 border-line pl-3">
                  <span className="text-[11px] text-ink-500 block">{formatRelativeDate(n.at)}</span>
                  {n.text}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-6">
          <h3 className="text-[13px] font-medium text-ink-900 mb-2">Add a note</h3>
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-line bg-surface p-3 text-sm text-ink-900 focus:border-accent"
            placeholder="e.g. Recruiter mentioned this reports directly to the regional director"
          />
          <button
            onClick={submitNote}
            disabled={savingNote || !noteDraft.trim()}
            className="mt-2 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-700 hover:border-accent disabled:opacity-50"
          >
            {savingNote ? "Saving..." : "Save note"}
          </button>
        </section>

        <section className="flex flex-wrap gap-2 pb-4">
          {(["reviewing", "shortlisted", "applied", "interview", "offer", "rejected", "dismissed"] as JobStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                disabled={job.status === status}
                className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-ink-700 hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mark {status}
              </button>
            )
          )}
        </section>
      </div>
    </div>
  );
}
