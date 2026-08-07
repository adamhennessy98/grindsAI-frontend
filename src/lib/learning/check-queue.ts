import type { SupabaseClient } from "@supabase/supabase-js";

export async function enqueueKcCheck(
  supabase: SupabaseClient,
  userId: string,
  item: { kcId: string; subjectId: string; reason?: string; source?: "free_text" | "system" },
): Promise<void> {
  const { data: existing } = await supabase
    .from("kc_check_queue")
    .select("id")
    .eq("user_id", userId)
    .eq("kc_id", item.kcId)
    .eq("status", "pending")
    .maybeSingle();
  if (existing) return;

  const { error } = await supabase.from("kc_check_queue").insert({
    user_id: userId,
    kc_id: item.kcId,
    subject_id: item.subjectId,
    reason: item.reason ?? null,
    source: item.source ?? "free_text",
    status: "pending",
  });
  if (error) throw error;
}
