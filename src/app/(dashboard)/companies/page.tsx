import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TIER_LABEL: Record<string, string> = {
  tier1_global: "Global firm",
  tier2_regional: "Regional firm",
  tier3_local: "Local firm",
  unknown: "Unclassified",
};

export default async function CompaniesPage() {
  const supabase = createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, quality_tier, is_target_company, country, notes")
    .order("is_target_company", { ascending: false })
    .order("name");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-ink-900">Companies</h1>
        <p className="text-sm text-ink-500 mt-1">Every employer seen across imported jobs.</p>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-ink-500">
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {(companies ?? []).map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2.5 font-medium text-ink-900">{c.name}</td>
                <td className="px-4 py-2.5 text-ink-700">{TIER_LABEL[c.quality_tier ?? "unknown"]}</td>
                <td className="px-4 py-2.5 text-ink-700">{c.country ?? "\u2014"}</td>
                <td className="px-4 py-2.5">
                  {c.is_target_company && (
                    <span className="rounded border border-accent/30 bg-accent-tint px-1.5 py-0.5 text-[10px] font-medium text-accent-dark">
                      Target
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-ink-500">{c.notes ?? ""}</td>
              </tr>
            ))}
            {(companies ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-500">
                  No companies yet — they&apos;ll appear here as jobs are imported.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
