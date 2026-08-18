import type { FitCategory } from "@/lib/types";
import { FIT_CATEGORY_LABEL } from "@/lib/types";

const CATEGORY_COLOR: Record<FitCategory, string> = {
  exceptional: "#3F7A5A",
  strong: "#2C4A6E",
  worth_considering: "#B8863B",
  stretch: "#9AA0A6",
  usually_skip: "#B5453B",
};

interface Props {
  score: number | null;
  category: FitCategory | null;
  size?: "sm" | "md";
}

const ARC_LENGTH = Math.PI * 40; // semicircle, r = 40

export function FitScoreBadge({ score, category, size = "md" }: Props) {
  const dims = size === "sm" ? { w: 72, h: 46 } : { w: 92, h: 58 };

  if (score === null || category === null) {
    return (
      <div style={{ width: dims.w }} className="flex flex-col items-center">
        <svg viewBox="0 0 100 58" width={dims.w} height={dims.h}>
          <path d="M10,50 A40,40 0 0 1 90,50" fill="none" stroke="#E7E5E0" strokeWidth="7" strokeLinecap="round" />
        </svg>
        <span className="font-mono text-[11px] text-ink-300">not scored</span>
      </div>
    );
  }

  const color = CATEGORY_COLOR[category];
  const filled = (Math.min(Math.max(score, 0), 100) / 100) * ARC_LENGTH;

  return (
    <div style={{ width: dims.w }} className="flex flex-col items-center" title={FIT_CATEGORY_LABEL[category]}>
      <svg viewBox="0 0 100 58" width={dims.w} height={dims.h}>
        <path d="M10,50 A40,40 0 0 1 90,50" fill="none" stroke="#E7E5E0" strokeWidth="7" strokeLinecap="round" />
        <path
          d="M10,50 A40,40 0 0 1 90,50"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${ARC_LENGTH}`}
        />
        <text x="50" y="46" textAnchor="middle" fontFamily="var(--font-plex-mono)" fontSize="20" fontWeight="500" fill="#1B1E22">
          {score}
        </text>
      </svg>
      <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color }}>
        {FIT_CATEGORY_LABEL[category].replace(" match", "")}
      </span>
    </div>
  );
}
