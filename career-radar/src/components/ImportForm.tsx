"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ImportResult {
  imported: number;
  duplicates: number;
  errors: { index: number; message: string }[];
}

export function ImportForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"json" | "manual">("json");
  const [jsonText, setJsonText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");

  const [manual, setManual] = useState({ title: "", company: "", source_url: "", location_city: "", location_country: "" });

  async function submitJson(e: React.FormEvent) {
    e.preventDefault();
    setParseError("");
    setResult(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setParseError("That doesn't look like valid JSON. Check for a missing bracket or comma.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/jobs/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setParseError(data.message ?? "Import failed.");
      return;
    }
    setResult(data);
    setJsonText("");
    router.refresh();
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const res = await fetch("/api/jobs/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...manual,
        source_name: "Manual",
        salary: { type: "not_disclosed" },
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setParseError(data.message ?? "Import failed.");
      return;
    }
    setResult(data);
    setManual({ title: "", company: "", source_url: "", location_city: "", location_country: "" });
    router.refresh();
  }

  const fieldClass = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink-900 focus:border-accent";

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("json")}
          className={clsx(
            "rounded-lg px-3 py-1.5 text-[13px]",
            mode === "json" ? "bg-accent text-white" : "text-ink-500 border border-line"
          )}
        >
          Paste structured JSON
        </button>
        <button
          onClick={() => setMode("manual")}
          className={clsx(
            "rounded-lg px-3 py-1.5 text-[13px]",
            mode === "manual" ? "bg-accent text-white" : "text-ink-500 border border-line"
          )}
        >
          Quick add by URL
        </button>
      </div>

      {mode === "json" ? (
        <form onSubmit={submitJson} className="space-y-3">
          <p className="text-[13px] text-ink-500">
            Paste the JSON produced by a Claude or ChatGPT discovery pass — a single job object, an array, or{" "}
            <code className="font-mono">{"{ \"jobs\": [...] }"}</code>.
          </p>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={14}
            placeholder='[{"title": "Digital Delivery Manager", "company": "AECOM", "source_name": "LinkedIn", "source_url": "https://...", ...}]'
            className={clsx(fieldClass, "font-mono text-[12px]")}
          />
          {parseError && <p className="text-[13px] text-brick">{parseError}</p>}
          <button
            type="submit"
            disabled={busy || !jsonText.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {busy ? "Importing..." : "Import"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitManual} className="space-y-3 max-w-md">
          <input
            required
            placeholder="Job title"
            value={manual.title}
            onChange={(e) => setManual({ ...manual, title: e.target.value })}
            className={fieldClass}
          />
          <input
            required
            placeholder="Company"
            value={manual.company}
            onChange={(e) => setManual({ ...manual, company: e.target.value })}
            className={fieldClass}
          />
          <input
            required
            type="url"
            placeholder="Job posting URL"
            value={manual.source_url}
            onChange={(e) => setManual({ ...manual, source_url: e.target.value })}
            className={fieldClass}
          />
          <div className="flex gap-3">
            <input
              placeholder="City"
              value={manual.location_city}
              onChange={(e) => setManual({ ...manual, location_city: e.target.value })}
              className={fieldClass}
            />
            <input
              placeholder="Country"
              value={manual.location_country}
              onChange={(e) => setManual({ ...manual, location_country: e.target.value })}
              className={fieldClass}
            />
          </div>
          {parseError && <p className="text-[13px] text-brick">{parseError}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {busy ? "Adding..." : "Add job"}
          </button>
          <p className="text-[12px] text-ink-500">
            This job will be unscored until you fill in a fit score from the job detail panel or re-import it with full
            details.
          </p>
        </form>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-4 text-sm">
          <p className="text-ink-900">
            Imported <span className="font-mono">{result.imported}</span>, skipped{" "}
            <span className="font-mono">{result.duplicates}</span> duplicate
            {result.duplicates === 1 ? "" : "s"}.
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-1 text-brick text-[13px]">
              {result.errors.map((e) => (
                <li key={e.index}>
                  Item {e.index + 1}: {e.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
