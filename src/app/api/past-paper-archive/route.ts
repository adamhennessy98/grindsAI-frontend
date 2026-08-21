import { NextResponse } from "next/server";
import { getPastPaperArchiveAsset, getPastPaperArchiveByTopic, getPastPaperArchiveDetail, isPastPaperArchiveSubject } from "@/lib/past-paper-archive";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const gate = await assertChatAllowed(supabase, user.id, user.email);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId")?.trim() ?? "";
  if (!isPastPaperArchiveSubject(subjectId)) return NextResponse.json({ error: "Past-paper archive is unavailable for this subject." }, { status: 404 });

  const questionId = searchParams.get("questionId");
  if (questionId) {
    const asset = searchParams.get("asset");
    if (asset !== null) {
      const assetIndex = Number(asset);
      if (!Number.isInteger(assetIndex) || assetIndex < 0) return NextResponse.json({ error: "Invalid visual asset." }, { status: 400 });
      const image = await getPastPaperArchiveAsset({ subjectId, id: questionId, assetIndex });
      if (!image) return NextResponse.json({ error: "Visual asset not found." }, { status: 404 });
      return new NextResponse(image.bytes, { headers: { "Content-Type": image.contentType, "Cache-Control": "private, max-age=3600" } });
    }
    const question = await getPastPaperArchiveDetail({ subjectId, id: questionId });
    if (!question) return NextResponse.json({ error: "Past-paper question not found." }, { status: 404 });
    return NextResponse.json({ question });
  }

  const level = searchParams.get("level") === "OL" ? "OL" : "HL";
  const topicId = searchParams.get("topicId")?.trim() || "general";
  return NextResponse.json({ years: await getPastPaperArchiveByTopic({ subjectId, level, topicId }) });
}
