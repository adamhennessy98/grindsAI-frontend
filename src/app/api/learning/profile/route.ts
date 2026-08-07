import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLearningProfile } from "@/lib/learning/profile";

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

  try {
    const profile = await getLearningProfile(supabase, user.id);
    return NextResponse.json(profile);
  } catch (err) {
    console.error("[learning/profile] GET failed:", err);
    return NextResponse.json({ error: "Could not load learning profile." }, { status: 500 });
  }
}
