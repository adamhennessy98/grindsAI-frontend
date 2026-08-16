import type { SupabaseClient } from "@supabase/supabase-js";
import { type BillingPlanId, isBillingPlanId, planSupportsSubjectCount } from "@/lib/billing-plans";

type AccessSource = "billing-disabled" | "developer" | "subscription";

export type SubscriptionAccess =
  | { ok: true; source: AccessSource; planId: BillingPlanId | null }
  | { ok: false; status: number; message: string; planId: BillingPlanId | null };

const LOCAL_DEVELOPER_EMAILS = new Set([
  "adamhennessey98@gmail.com",
  "clancyontree@gmail.com",
]);

function configuredPrivilegedEmails() {
  return new Set(
    (process.env.BILLING_PRIVILEGED_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isDeveloperBypass(email: string | null | undefined) {
  if (!email) return false;
  const normalised = email.trim().toLowerCase();
  const configured = configuredPrivilegedEmails();
  if (configured.has(normalised)) return true;
  return process.env.NODE_ENV !== "production" && LOCAL_DEVELOPER_EMAILS.has(normalised);
}

export function isBillingEnforced() {
  return process.env.BILLING_ENFORCEMENT === "true" || process.env.CHAT_REQUIRES_SUBSCRIPTION === "true";
}

function subjectCount(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()).length : 0;
}

export async function getSubscriptionAccess(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<SubscriptionAccess> {
  if (!isBillingEnforced()) return { ok: true, source: "billing-disabled", planId: null };
  if (isDeveloperBypass(email)) return { ok: true, source: "developer", planId: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_plan, billing_subject_count, subjects")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { ok: false, status: 500, message: "Could not verify your subscription.", planId: null };

  const planId = isBillingPlanId(data?.subscription_plan) ? data.subscription_plan : null;
  const active = data?.subscription_status === "active" || data?.subscription_status === "trialing";
  if (!active) {
    return { ok: false, status: 402, message: "Choose a plan to continue using GrindsAI.", planId };
  }

  if (planId && !planSupportsSubjectCount(planId, subjectCount(data?.subjects))) {
    return {
      ok: false,
      status: 402,
      message: "Your current plan does not cover all of your selected subjects. Choose a plan with more subjects to continue.",
      planId,
    };
  }

  if (
    planId === "individual" &&
    typeof data?.billing_subject_count === "number" &&
    data.billing_subject_count > 0 &&
    subjectCount(data?.subjects) > data.billing_subject_count
  ) {
    return {
      ok: false,
      status: 402,
      message: "Your selected subjects need a billing update before you can continue. Manage your subscription to add them.",
      planId,
    };
  }

  // Existing active subscribers predate plan metadata. Keep their access intact.
  return { ok: true, source: "subscription", planId };
}

export async function assertChatAllowed(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const access = await getSubscriptionAccess(supabase, userId, email);
  return access.ok ? { ok: true } : access;
}
