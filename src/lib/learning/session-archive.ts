import type { SupabaseClient } from "@supabase/supabase-js";
import { getTopic } from "@/lib/constants";

export type ArchivedSession = {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  sessionType: string;
  summaryLine: string | null;
  kcIds: string[];
  kcLabels: string[];
  gradedOutcome: string | null;
  endedAt: string | null;
  startedAt: string;
};

export async function listArchivedSessions(
  supabase: SupabaseClient,
  userId: string,
  input: { subjectId: string; topicId?: string | null; limit?: number },
): Promise<ArchivedSession[]> {
  let query = supabase
    .from("study_sessions")
    .select("id, subject_id, topic_id, session_type, summary_line, kc_ids, graded_outcome, ended_at, started_at")
    .eq("user_id", userId)
    .eq("subject_id", input.subjectId)
    .eq("status", "ended")
    .order("ended_at", { ascending: false })
    .limit(input.limit ?? 40);

  if (input.topicId && input.topicId !== "general") {
    query = query.eq("topic_id", input.topicId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const kcIds = [...new Set((data ?? []).flatMap((row) => (Array.isArray(row.kc_ids) ? (row.kc_ids as string[]) : [])))];
  const labelByKc = new Map<string, string>();
  if (kcIds.length) {
    const { data: kcs } = await supabase.from("knowledge_components").select("kc_id, label").in("kc_id", kcIds);
    for (const kc of kcs ?? []) {
      labelByKc.set(kc.kc_id as string, kc.label as string);
    }
  }

  return (data ?? []).map((row) => {
    const topicId = (row.topic_id as string) || "general";
    const ids = Array.isArray(row.kc_ids) ? (row.kc_ids as string[]) : [];
    return {
      id: row.id as string,
      subjectId: row.subject_id as string,
      topicId,
      topicName: getTopic(input.subjectId, topicId).name,
      sessionType: row.session_type as string,
      summaryLine: (row.summary_line as string | null) ?? null,
      kcIds: ids,
      kcLabels: ids.map((id) => labelByKc.get(id) ?? id.split(".").pop() ?? id),
      gradedOutcome: (row.graded_outcome as string | null) ?? null,
      endedAt: (row.ended_at as string | null) ?? null,
      startedAt: row.started_at as string,
    };
  });
}
