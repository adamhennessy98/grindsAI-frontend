import { NextResponse } from "next/server";
import {
  getStudentProfile,
  parseStudentProfileInput,
} from "@/lib/profile";
import { upsertStudentPrefs } from "@/lib/learning/profile";
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

  try {
    // Preferences are updated via a security-definer RPC so billing columns remain server controlled.
    await upsertStudentPrefs(supabase, profile, { markComplete: Boolean(profile.completedAt) });
  } catch (error) {
    console.error("[profile] save failed:", error);
    return NextResponse.json({ error: "Could not save your profile." }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
