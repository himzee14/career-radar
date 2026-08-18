import { createHash } from "crypto";

const SUFFIX_WORDS = new Set([
  "iii",
  "ii",
  "i",
  "sr",
  "jr",
  "remote",
  "hybrid",
  "onsite",
  "new",
]);

/**
 * Lowercases, strips punctuation, and drops common trailing qualifiers so
 * "Senior BIM Manager (Remote) - New" and "senior bim manager" line up.
 */
export function normalizeTitle(title: string): string {
  const cleaned = title
    .toLowerCase()
    .replace(/[()[\]|,\-–—/]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").filter((w) => !SUFFIX_WORDS.has(w));
  return words.join(" ").trim();
}

export function normalizeCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(inc|ltd|llc|plc|pvt|pte|corp|corporation|limited|group)\b\.?/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A stable fallback signature for duplicate detection when there's no
 * shared external_id across sources (e.g. the same vacancy on LinkedIn
 * and on the company's careers page).
 */
export function contentHash(input: {
  company: string;
  title: string;
  city?: string | null;
  country?: string | null;
}): string {
  const key = [
    normalizeCompany(input.company),
    normalizeTitle(input.title),
    (input.city ?? "").toLowerCase().trim(),
    (input.country ?? "").toLowerCase().trim(),
  ].join("|");
  return createHash("sha1").update(key).digest("hex");
}
