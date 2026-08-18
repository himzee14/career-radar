import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json().catch(() => null);

  if (!body?.id) {
    return NextResponse.json({ message: "Missing profile id." }, { status: 400 });
  }

  const { id, ...updates } = body;
  const { error } = await supabase.from("search_profiles").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
