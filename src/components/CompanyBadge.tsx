import type { Company } from "@/lib/types";

const TIER_LABEL: Record<string, string> = {
  tier1_global: "Global firm",
  tier2_regional: "Regional firm",
  tier3_local: "Local firm",
  unknown: "",
};

export function CompanyBadge({ company, fallbackName }: { company?: Company | null; fallbackName: string }) {
  const name = company?.name ?? fallbackName;
  const tier = company?.quality_tier ? TIER_LABEL[company.quality_tier] : "";

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="truncate text-sm font-medium text-ink-900">{name}</span>
      {company?.is_target_company && (
        <span className="shrink-0 rounded border border-accent/30 bg-accent-tint px-1.5 py-0.5 text-[10px] font-medium text-accent-dark">
          Target
        </span>
      )}
      {tier && !company?.is_target_company && (
        <span className="shrink-0 text-[11px] text-ink-500">{tier}</span>
      )}
    </div>
  );
}
