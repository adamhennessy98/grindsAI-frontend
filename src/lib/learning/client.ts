import type { LearningEventInput } from "@/lib/learning/kc";

/** Fire-and-forget client helper — never throws to callers. */
export async function postLearningEvent(
  input: LearningEventInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/learning/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error ?? `Event failed (${response.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Event failed" };
  }
}
