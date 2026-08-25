import { NextResponse } from "next/server";
import { getRecommendedNextStep } from "@/lib/learning/next-step";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
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

  const subjectId = new URL(request.url).searchParams.get("subjectId");

  try {
    const nextStep = await getRecommendedNextStep(supabase, user.id, subjectId);
    return NextResponse.json({ nextStep });
  } catch (err) {
    console.error("[learning/next-step] GET failed:", err);
    return NextResponse.json({ error: "Could not load next step." }, { status: 500 });
  }
}
