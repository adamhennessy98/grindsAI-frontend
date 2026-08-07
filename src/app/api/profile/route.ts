import { NextResponse } from "next/server";
import {
  getStudentProfile,
  parseStudentProfileInput,
  upsertStudentProfile,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getStudentProfile(supabase, user.id);
  if (!profile) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const profile = parseStudentProfileInput(body);
  if (!profile) {
    return NextResponse.json({ error: "Invalid student profile." }, { status: 400 });
  }

  const displayName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : null;

  const result = await upsertStudentProfile(supabase, user.id, profile, {
    displayName,
    email: user.email ?? null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
