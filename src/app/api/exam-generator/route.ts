import { NextResponse } from "next/server";
import { generateExamQuestions, resolveExamGeneratorContext } from "@/lib/exam-generator-ai";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import type { ExamGeneratorRequest } from "@/lib/exam-generator";

type ExamGeneratorBody = Partial<ExamGeneratorRequest>;

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

  const gate = await assertChatAllowed(supabase, user.id);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  let body: ExamGeneratorBody;
  try {
    body = (await request.json()) as ExamGeneratorBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const context = resolveExamGeneratorContext({
    subjectId: typeof body.subjectId === "string" ? body.subjectId : "",
    level: body.level === "OL" ? "OL" : "HL",
    topicId: typeof body.topicId === "string" && body.topicId.trim() ? body.topicId.trim() : "general",
    questionType: body.questionType === "short" || body.questionType === "long" ? body.questionType : "mixed",
    difficulty: body.difficulty === "easy" ? "easy" : "exam",
    count: 1,
    includeHints: Boolean(body.includeHints),
    includeWorkedSolution: Boolean(body.includeWorkedSolution),
    includeMarkingScheme: false,
  });

  if (!context) {
    return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
  }

  try {
    const result = await generateExamQuestions(context);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[exam-generator] generation failed:", error);
    const message = error instanceof Error ? error.message : "Could not generate questions.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
