import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { importJobSchema, extractRawItems, type ImportJobInput } from "@/lib/importSchema";
import { normalizeTitle, normalizeCompany, contentHash } from "@/lib/dedup";
import { fitCategoryFromScore } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Request body was not valid JSON." }, { status: 400 });
  }

  let rawItems: unknown[];
  try {
    rawItems = extractRawItems(body);
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }

  const errors: { index: number; message: string }[] = [];
  const validItems: ImportJobInput[] = [];

  rawItems.forEach((item, index) => {
    const parsed = importJobSchema.safeParse(item);
    if (!parsed.success) {
      errors.push({ index, message: parsed.error.issues.map((i) => i.message).join("; ") });
    } else {
      validItems.push(parsed.data);
    }
  });

  let imported = 0;
  let duplicates = 0;

  for (let i = 0; i < validItems.length; i++) {
    const job = validItems[i];
    const hash = contentHash({
      company: job.company,
      title: job.title,
      city: job.location_city,
      country: job.location_country,
    });

    // Duplicate check: same source + external_id, or same fallback content hash.
    let existing = null;
    if (job.external_id) {
      const { data } = await supabase
        .from("jobs")
        .select("id")
        .eq("source_name", job.source_name)
        .eq("external_id", job.external_id)
        .maybeSingle();
      existing = data;
    }
    if (!existing) {
      const { data } = await supabase.from("jobs").select("id").eq("content_hash", hash).maybeSingle();
      existing = data;
    }
    if (existing) {
      duplicates++;
      continue;
    }

    // Resolve or create the company.
    const normalizedCompany = normalizeCompany(job.company);
    let companyId: string | null = null;
    const { data: companyMatch } = await supabase
      .from("companies")
      .select("id, name")
      .ilike("name", job.company)
      .maybeSingle();

    if (companyMatch) {
      companyId = companyMatch.id;
    } else {
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({ name: job.company })
        .select("id")
        .single();
      if (!companyError && newCompany) companyId = newCompany.id;
    }

    const fitScore = job.fit_score ?? null;

    const { error: insertError } = await supabase.from("jobs").insert({
      external_id: job.external_id ?? null,
      title: job.title,
      title_normalized: normalizeTitle(job.title),
      company_id: companyId,
      company_name_raw: job.company,
      location_city: job.location_city ?? null,
      location_country: job.location_country ?? null,
      work_mode: job.work_mode ?? "unknown",
      employment_type: job.employment_type ?? null,
      seniority: job.seniority ?? null,
      description: job.description ?? null,
      source_name: job.source_name,
      source_url: job.source_url,
      official_company_url: job.official_company_url ?? null,
      date_posted: job.date_posted ?? null,
      salary_min: job.salary?.min ?? null,
      salary_max: job.salary?.max ?? null,
      salary_currency: job.salary?.currency ?? null,
      salary_type: job.salary?.type ?? "not_disclosed",
      fit_score: fitScore,
      fit_category: fitScore !== null ? fitCategoryFromScore(fitScore) : null,
      score_breakdown: job.score_breakdown ?? null,
      strengths: job.strengths ?? null,
      gaps: job.gaps ?? null,
      fit_reason: job.fit_reason ?? null,
      status: "new",
      notes: [],
      content_hash: hash,
    });

    if (insertError) {
      errors.push({ index: i, message: insertError.message });
    } else {
      imported++;
    }
  }

  return NextResponse.json({ imported, duplicates, errors });
}
