import { NextResponse } from "next/server";
import { getPastPaperArchiveAsset, getPastPaperArchiveByTopic, getPastPaperArchiveDetail } from "@/lib/past-paper-archive";
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
  const questionId = searchParams.get("questionId");
  if (questionId) {
    const asset = searchParams.get("asset");
    if (asset !== null) {
      const index = Number(asset);
      if (!Number.isInteger(index) || index < 0) return NextResponse.json({ error: "Invalid visual asset." }, { status: 400 });
      const image = await getPastPaperArchiveAsset({ subjectId: "maths", id: questionId, assetIndex: index });
      if (!image) return NextResponse.json({ error: "Visual asset not found." }, { status: 404 });
      if ("remoteUrl" in image) return NextResponse.redirect(image.remoteUrl, 307);
      return new NextResponse(new Uint8Array(image.bytes), { headers: { "Content-Type": image.contentType, "Cache-Control": "private, max-age=3600" } });
    }
    const question = await getPastPaperArchiveDetail({ subjectId: "maths", id: questionId });
    if (!question) return NextResponse.json({ error: "Past-paper question not found." }, { status: 404 });
    return NextResponse.json({ question });
  }

  const level = searchParams.get("level") === "OL" ? "OL" : "HL";
  const topicId = searchParams.get("topicId")?.trim() || "general";
  return NextResponse.json({ years: await getPastPaperArchiveByTopic({ subjectId: "maths", level, topicId }) });
}
