"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { JOB_STATUSES, STATUS_LABEL } from "@/lib/types";
import clsx from "clsx";

const QUICK_FILTERS: { label: string; params: Record<string, string> }[] = [
  { label: "UAE", params: { location: "UAE" } },
  { label: "Delhi NCR", params: { location: "NCR" } },
  { label: "80%+ match", params: { minScore: "80" } },
  { label: "Posted < 7 days", params: { postedWithin: "7" } },
  { label: "Target companies only", params: { targetOnly: "1" } },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyQuickFilter(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (next.get(key) === value) next.delete(key);
      else next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((qf) => {
          const active = Object.entries(qf.params).every(([k, v]) => searchParams.get(k) === v);
          return (
            <button
              key={qf.label}
              onClick={() => applyQuickFilter(qf.params)}
              className={clsx(
                "rounded-full border px-3 py-1 text-[12px] transition-colors",
                active ? "border-accent bg-accent-tint text-accent-dark" : "border-line text-ink-500 hover:border-accent/40"
              )}
            >
              {qf.label}
            </button>
          );
        })}
        {searchParams.toString() && (
          <button onClick={clearAll} className="rounded-full px-3 py-1 text-[12px] text-brick hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          defaultValue={searchParams.get("location") ?? ""}
          onBlur={(e) => updateParam("location", e.target.value)}
          placeholder="Location contains..."
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-900 focus:border-accent"
        />
        <input
          defaultValue={searchParams.get("company") ?? ""}
          onBlur={(e) => updateParam("company", e.target.value)}
          placeholder="Company contains..."
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-900 focus:border-accent"
        />
        <select
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-900 focus:border-accent"
        >
          <option value="">All statuses</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          defaultValue={searchParams.get("minScore") ?? ""}
          onChange={(e) => updateParam("minScore", e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-900 focus:border-accent"
        >
          <option value="">Any score</option>
          <option value="90">90+</option>
          <option value="80">80+</option>
          <option value="70">70+</option>
          <option value="60">60+</option>
        </select>
      </div>
    </div>
  );
}
