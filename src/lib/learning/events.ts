import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_BKT, updateBkt, type BktState } from "@/lib/learning/bkt";
import type { LearningEventInput } from "@/lib/learning/kc";

export type RecordLearningEventResult = {
  eventId: string;
  attemptIndexOnKc: number;
  masteryP: number;
};

async function nextAttemptIndex(
  supabase: SupabaseClient,
  userId: string,
  kcId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("learning_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kc_id", kcId);
  if (error) throw error;
  return (count ?? 0) + 1;
}

async function loadKcState(
  supabase: SupabaseClient,
  userId: string,
  kcId: string,
): Promise<BktState> {
  const { data, error } = await supabase
    .from("student_kc_state")
    .select("mastery_p, p_l, p_t, p_g, p_s, evidence_n")
    .eq("user_id", userId)
    .eq("kc_id", kcId)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    return { ...DEFAULT_BKT, masteryP: DEFAULT_BKT.pL, evidenceN: 0 };
  }
  return {
    pL: Number(data.p_l),
    pT: Number(data.p_t),
    pG: Number(data.p_g),
    pS: Number(data.p_s),
    masteryP: Number(data.mastery_p),
    evidenceN: Number(data.evidence_n),
  };
}

export async function recordLearningEvent(
  supabase: SupabaseClient,
  userId: string,
  input: LearningEventInput,
): Promise<RecordLearningEventResult> {
  if (!input.kcId?.trim()) {
    throw new Error("kc_id is required");
  }

  const attemptIndexOnKc = await nextAttemptIndex(supabase, userId, input.kcId);
  const prev = await loadKcState(supabase, userId, input.kcId);
  const next = updateBkt(prev, input.outcome, { source: input.source });
  const now = new Date().toISOString();

  const { data: eventRow, error: insertErr } = await supabase
    .from("learning_events")
    .insert({
      user_id: userId,
      kc_id: input.kcId,
      subject_id: input.subjectId,
      chunk_id: input.chunkId ?? null,
      outcome: input.outcome,
      marks_earned: input.marksEarned ?? null,
      marks_possible: input.marksPossible ?? null,
      attempt_index_on_kc: attemptIndexOnKc,
      hint_depth: input.hintDepth ?? 0,
      scaffolded: input.scaffolded ?? false,
      transfer_check: input.transferCheck ?? false,
      error_type: input.errorType ?? null,
      latency_ms: input.latencyMs ?? null,
      source: input.source,
      conversation_id: input.conversationId ?? null,
      message_id: input.messageId ?? null,
    })
    .select("id")
    .single();

  if (insertErr || !eventRow) {
    throw insertErr ?? new Error("Failed to insert learning event");
  }

  const { error: upsertErr } = await supabase.from("student_kc_state").upsert(
    {
      user_id: userId,
      kc_id: input.kcId,
      mastery_p: next.masteryP,
      p_l: next.pL,
      p_t: next.pT,
      p_g: next.pG,
      p_s: next.pS,
      evidence_n: next.evidenceN,
      last_event_at: now,
      last_outcome: input.outcome,
      updated_at: now,
    },
    { onConflict: "user_id,kc_id" },
  );

  if (upsertErr) throw upsertErr;

  return {
    eventId: eventRow.id as string,
    attemptIndexOnKc,
    masteryP: next.masteryP,
  };
}
