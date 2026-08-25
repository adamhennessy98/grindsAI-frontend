import { NextResponse } from "next/server";
import { generateExamQuestions, resolveExamGeneratorContext } from "@/lib/exam-generator-ai";
import { assertChatAllowed } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import { consumeAiRateLimit, isSameOriginRequest, readJsonBody } from "@/lib/request-security";
import type { ExamGeneratorRequest } from "@/lib/exam-generator";

type ExamGeneratorBody = Partial<ExamGeneratorRequest>;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

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

  const gate = await assertChatAllowed(supabase, user.id, user.email);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  const parsed = await readJsonBody<ExamGeneratorBody>(request, 16_000);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const limit = await consumeAiRateLimit(supabase, "exam-generator");
  if (!limit.ok) return NextResponse.json({ error: limit.error }, { status: limit.status });
  const purpose = body.purpose === "topic-check" ? "topic-check" : "exam-practice";

  const context = resolveExamGeneratorContext({
    subjectId: typeof body.subjectId === "string" ? body.subjectId : "",
    level: body.level === "OL" ? "OL" : "HL",
    topicId: typeof body.topicId === "string" && body.topicId.trim() ? body.topicId.trim() : "general",
    questionType: body.questionType === "short" || body.questionType === "long" ? body.questionType : "mixed",
    difficulty: body.difficulty === "easy" ? "easy" : "exam",
    count: purpose === "topic-check" && typeof body.count === "number" ? body.count : 1,
    includeHints: Boolean(body.includeHints),
    includeWorkedSolution: Boolean(body.includeWorkedSolution),
    includeMarkingScheme: false,
    purpose,
    topicCheckStep: typeof body.topicCheckStep === "number" ? body.topicCheckStep : undefined,
    topicCheckTotal: typeof body.topicCheckTotal === "number" ? body.topicCheckTotal : undefined,
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
