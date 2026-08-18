import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { JOB_STATUSES } from "@/lib/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();

  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (!status || !JOB_STATUSES.includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
