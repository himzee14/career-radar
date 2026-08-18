import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { JobNote } from "@/lib/types";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = body?.text?.trim();
  if (!text) {
    return NextResponse.json({ message: "Note text is required." }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("jobs")
    .select("notes")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 404 });
  }

  const notes: JobNote[] = Array.isArray(existing?.notes) ? existing.notes : [];
  notes.push({ at: new Date().toISOString(), text });

  const { error: updateError } = await supabase.from("jobs").update({ notes }).eq("id", id);
  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
