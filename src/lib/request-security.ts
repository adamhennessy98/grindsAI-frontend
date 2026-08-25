import type { SupabaseClient } from "@supabase/supabase-js";

export type ProtectedAiRoute = "chat" | "exam-generator";

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<
  | { ok: true; body: T }
  | { ok: false; status: 400 | 413; error: string }
> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, status: 413, error: "Request is too large." };
  }
  try {
    return { ok: true, body: JSON.parse(text) as T };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body." };
  }
}

export async function consumeAiRateLimit(supabase: SupabaseClient, route: ProtectedAiRoute) {
  const { data, error } = await supabase.rpc("consume_student_api_rate_limit", { p_route: route });
  if (error) {
    console.error(`[rate-limit] ${route} failed:`, error);

    // Development can proceed before the accompanying RPC migration is applied.
    // Production remains fail-closed so paid AI routes are never left unprotected.
    if (process.env.NODE_ENV !== "production") {
      return { ok: true as const };
    }

    return { ok: false as const, status: 503, error: "The study service is temporarily unavailable. Please try again shortly." };
  }
  if (!data) {
    return { ok: false as const, status: 429, error: "You have made a lot of requests. Please wait a moment and try again." };
  }
  return { ok: true as const };
}
