import type { Job } from "./types";

const CURRENCY_LOCALE: Record<string, string> = {
  AED: "en-AE",
  INR: "en-IN",
  AUD: "en-AU",
  GBP: "en-GB",
  EUR: "de-DE",
  USD: "en-US",
};

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatSalary(job: Pick<Job, "salary_min" | "salary_max" | "salary_currency" | "salary_type">): string {
  if (job.salary_type === "not_disclosed" || (!job.salary_min && !job.salary_max)) {
    return "Not disclosed";
  }
  const currency = job.salary_currency ?? "USD";
  const label = job.salary_type === "estimated" ? " (estimated)" : "";

  if (job.salary_min && job.salary_max && job.salary_min !== job.salary_max) {
    return `${formatAmount(job.salary_min, currency)} \u2013 ${formatAmount(job.salary_max, currency)}${label}`;
  }
  const single = job.salary_max ?? job.salary_min;
  if (single) return `${formatAmount(single, currency)}${label}`;
  return "Not disclosed";
}

export function formatRelativeDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatLocation(job: Pick<Job, "location_city" | "location_country" | "work_mode">): string {
  const parts = [job.location_city, job.location_country].filter(Boolean);
  const place = parts.length ? parts.join(", ") : "Location not specified";
  if (job.work_mode === "remote") return `Remote \u00b7 ${place === "Location not specified" ? "any" : place}`;
  if (job.work_mode === "hybrid") return `${place} \u00b7 Hybrid`;
  return place;
}
