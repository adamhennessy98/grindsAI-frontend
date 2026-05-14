import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertChatAllowed(supabase: SupabaseClient, userId: string): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  if (process.env.CHAT_REQUIRES_SUBSCRIPTION !== "true") {
    return { ok: true };
  }

  const { data, error } = await supabase.from("profiles").select("subscription_status").eq("id", userId).maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: "Could not verify subscription." };
  }

  if (data?.subscription_status === "active") {
    return { ok: true };
  }

  return { ok: false, status: 402, message: "An active subscription is required to use the tutor." };
}
