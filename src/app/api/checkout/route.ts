import { NextResponse } from "next/server";
import { type BillingPlanId, BILLING_PLANS, isBillingPlanId, planSupportsSubjectCount } from "@/lib/billing-plans";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { getCheckoutLineItems, isStripeBillingConfigured } from "@/lib/stripe-plans";
import { createClient } from "@/lib/supabase/server";

type CheckoutBody = { plan?: unknown };

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function selectedSubjectCount(subjects: unknown) {
  return Array.isArray(subjects)
    ? subjects.filter((subject): subject is string => typeof subject === "string" && subject.trim().length > 0).length
    : 0;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 403 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Billing is temporarily unavailable." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Choose a plan to continue." }, { status: 400 });
  }
  if (!isBillingPlanId(body.plan)) {
    return NextResponse.json({ error: "Choose a valid plan." }, { status: 400 });
  }
  const planId: BillingPlanId = body.plan;

  if (!isStripeBillingConfigured()) {
    return NextResponse.json({ error: "Checkout is not configured yet. Please try again shortly." }, { status: 503 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("subjects, subscription_status, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    return NextResponse.json({ error: "Could not load your study profile." }, { status: 500 });
  }

  const subjectCount = Math.max(1, selectedSubjectCount(profile?.subjects));
  if (!planSupportsSubjectCount(planId, subjectCount)) {
    const limit = BILLING_PLANS[planId].maxSubjects;
    return NextResponse.json(
      { error: `${BILLING_PLANS[planId].name} supports up to ${limit} subjects. Choose a plan with more subjects.` },
      { status: 400 },
    );
  }

  if (profile?.stripe_subscription_id && ["active", "trialing", "past_due"].includes(profile.subscription_status ?? "")) {
    return NextResponse.json({ error: "You already have a subscription. Manage it from billing instead." }, { status: 409 });
  }

  const checkoutLines = getCheckoutLineItems(planId, subjectCount);
  if (!checkoutLines.ok) {
    return NextResponse.json({ error: checkoutLines.message }, { status: 503 });
  }

  const site = getSiteUrl(new URL(request.url).origin);
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: profile?.stripe_customer_id || undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email ?? undefined,
      client_reference_id: user.id,
      line_items: checkoutLines.lineItems,
      success_url: `${site}/pricing?checkout=success`,
      cancel_url: `${site}/pricing?checkout=cancelled`,
      metadata: { userId: user.id, planId, subjectCount: String(subjectCount) },
      subscription_data: { metadata: { userId: user.id, planId } },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Stripe session creation failed:", error);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
