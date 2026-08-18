interface Counts {
  new: number;
  strongMatches: number;
  applied: number;
  interview: number;
  offer: number;
}

export function PipelineStats({ counts }: { counts: Counts }) {
  const items: { label: string; value: number }[] = [
    { label: "New jobs", value: counts.new },
    { label: "Strong matches (80%+)", value: counts.strongMatches },
    { label: "Applied", value: counts.applied },
    { label: "Interviews", value: counts.interview },
    { label: "Offers", value: counts.offer },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-line bg-surface p-4 shadow-card">
          <p className="text-2xl font-mono font-medium text-ink-900">{item.value}</p>
          <p className="text-[12px] text-ink-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
