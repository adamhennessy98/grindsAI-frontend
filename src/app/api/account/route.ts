import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSameOriginRequest, readJsonBody } from "@/lib/request-security";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = await readJsonBody<{ confirmation?: string }>(request, 2_000);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (parsed.body.confirmation !== "DELETE") return NextResponse.json({ error: "Type DELETE to confirm permanent account deletion." }, { status: 400 });

  const { data: profile, error: profileError } = await supabase.from("profiles").select("subscription_status").eq("id", user.id).maybeSingle();
  if (profileError) return NextResponse.json({ error: "Could not verify your subscription." }, { status: 500 });
  if (["active", "trialing", "past_due"].includes(profile?.subscription_status ?? "")) {
    return NextResponse.json({ error: "Cancel your subscription in Billing before deleting your account." }, { status: 409 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[account] delete failed:", error);
    return NextResponse.json({ error: "Could not delete your account. Please contact support if this continues." }, { status: 500 });
  }
}
