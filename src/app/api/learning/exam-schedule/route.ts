import { NextResponse } from "next/server";
import {
  listExamSchedule,
  saveExamSchedule,
  upsertSubjectExamDate,
  type ExamScheduleInput,
} from "@/lib/learning/exam-schedule";
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
    const schedule = await listExamSchedule(supabase, user.id);
    if (subjectId) {
      const entry = schedule.find((row) => row.subjectId === subjectId) ?? null;
      return NextResponse.json({ entry, schedule });
    }
    return NextResponse.json({ schedule });
  } catch (err) {
    console.error("[learning/exam-schedule] GET failed:", err);
    return NextResponse.json({ error: "Could not load exam schedule." }, { status: 500 });
  }
}

type Body = {
  /** Full replace (legacy / bulk). */
  entries?: ExamScheduleInput[];
  /** Single-subject upsert; set examDate null/empty to clear. */
  entry?: {
    subjectId: string;
    examDate?: string | null;
    paperLabel?: string | null;
    level?: "HL" | "OL" | null;
  };
};

export async function PUT(request: Request) {
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

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    if (body.entry?.subjectId) {
      const entry = await upsertSubjectExamDate(supabase, user.id, {
        subjectId: body.entry.subjectId,
        examDate: body.entry.examDate ?? null,
        paperLabel: body.entry.paperLabel,
        level: body.entry.level,
      });
      return NextResponse.json({ entry });
    }

    if (!Array.isArray(body.entries)) {
      return NextResponse.json({ error: "Provide entry or entries." }, { status: 400 });
    }

    const schedule = await saveExamSchedule(supabase, user.id, body.entries);
    return NextResponse.json({ schedule });
  } catch (err) {
    console.error("[learning/exam-schedule] PUT failed:", err);
    return NextResponse.json({ error: "Could not save exam schedule." }, { status: 500 });
  }
}
