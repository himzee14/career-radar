"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchProfile } from "@/lib/types";

function toLines(values: string[]): string {
  return values.join("\n");
}
function fromLines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function SettingsForm({ profile }: { profile: SearchProfile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [locations, setLocations] = useState(toLines(profile.locations));
  const [roleFamilies, setRoleFamilies] = useState(toLines(profile.role_families));
  const [avoidTerms, setAvoidTerms] = useState(toLines(profile.avoid_terms));
  const [mustHave, setMustHave] = useState(toLines(profile.must_have_skills));
  const [niceToHave, setNiceToHave] = useState(toLines(profile.nice_to_have_skills));
  const [salaryMin, setSalaryMin] = useState(profile.salary_preferences?.min?.toString() ?? "");
  const [salaryCurrency, setSalaryCurrency] = useState(profile.salary_preferences?.currency ?? "USD");
  const [hardFloor, setHardFloor] = useState(profile.salary_preferences?.hard_floor ?? false);
  const [weights, setWeights] = useState(profile.scoring_weights);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: profile.id,
        locations: fromLines(locations),
        role_families: fromLines(roleFamilies),
        avoid_terms: fromLines(avoidTerms),
        must_have_skills: fromLines(mustHave),
        nice_to_have_skills: fromLines(niceToHave),
        salary_preferences: {
          min: salaryMin ? Number(salaryMin) : undefined,
          currency: salaryCurrency,
          hard_floor: hardFloor,
        },
        scoring_weights: weights,
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const fieldClass = "w-full rounded-lg border border-line bg-surface p-3 text-sm text-ink-900 focus:border-accent";

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-medium text-ink-900 mb-1">Target locations (one per line)</label>
          <textarea rows={5} value={locations} onChange={(e) => setLocations(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-900 mb-1">Target role families (one per line)</label>
          <textarea rows={5} value={roleFamilies} onChange={(e) => setRoleFamilies(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-900 mb-1">Roles / terms to avoid</label>
          <textarea rows={5} value={avoidTerms} onChange={(e) => setAvoidTerms(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-900 mb-1">Must-have skills</label>
          <textarea rows={5} value={mustHave} onChange={(e) => setMustHave(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-900 mb-1">Nice-to-have skills</label>
          <textarea rows={5} value={niceToHave} onChange={(e) => setNiceToHave(e.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-medium text-ink-900 mb-2">Salary preference</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Minimum"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            className={fieldClass}
          />
          <select value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value)} className={fieldClass}>
            {["AED", "INR", "AUD", "GBP", "EUR", "USD"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="mt-2 flex items-center gap-2 text-[13px] text-ink-700">
          <input type="checkbox" checked={hardFloor} onChange={(e) => setHardFloor(e.target.checked)} />
          Treat this as a hard floor, not just a preference
        </label>
      </div>

      <div>
        <h3 className="text-[13px] font-medium text-ink-900 mb-2">Scoring weights (should total 100)</h3>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ["role_alignment", "Role alignment"],
              ["leadership_fit", "Leadership fit"],
              ["technical_fit", "Technical fit"],
              ["company_quality", "Company quality"],
              ["location", "Location"],
              ["compensation", "Compensation"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-[11px] text-ink-500 mb-1">{label}</label>
              <input
                type="number"
                value={weights[key]}
                onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })}
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save search settings"}
      </button>
    </form>
  );
}
