import { NextResponse } from "next/server";
import { LEGAL_DOCUMENT_VERSION, type LegalAcceptanceSource } from "@/lib/legal-consent";
import { isSameOriginRequest, readJsonBody } from "@/lib/request-security";
import { createClient } from "@/lib/supabase/server";

type AcceptanceBody = { source?: unknown };

function isSource(value: unknown): value is LegalAcceptanceSource {
  return value === "signup" || value === "reacceptance";
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const payload = await readJsonBody<AcceptanceBody>(request, 2_000);
  if (!payload.ok) {
    return NextResponse.json({ error: payload.error }, { status: payload.status });
  }
  if (!isSource(payload.body.source)) {
    return NextResponse.json({ error: "Invalid acceptance request." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.rpc("record_current_legal_acceptance", {
    p_source: payload.body.source,
  });
  if (error) {
    console.error("[legal] Could not record legal acceptance:", error);
    return NextResponse.json({ error: "Could not record your acceptance. Please try again." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, version: LEGAL_DOCUMENT_VERSION });
}
