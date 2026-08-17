import "server-only";

import type Stripe from "stripe";
import {
  type BillingPlanId,
  BILLING_PLANS,
  planSupportsSubjectCount,
} from "@/lib/billing-plans";

type CheckoutLines =
  | { ok: true; lineItems: Array<{ price: string; quantity: number }> }
  | { ok: false; message: string };

function priceId(name: string) {
  return process.env[name]?.trim() || "";
}

export function isStripeBillingConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      priceId("STRIPE_PRICE_INDIVIDUAL_SUBJECT_ID") &&
      priceId("STRIPE_PRICE_ADDITIONAL_SUBJECT_ID") &&
      priceId("STRIPE_PRICE_UP_TO_SEVEN_SUBJECTS_ID") &&
      priceId("STRIPE_PRICE_UNLIMITED_SUBJECTS_ID"),
  );
}

export function getCheckoutLineItems(planId: BillingPlanId, subjectCount: number): CheckoutLines {
  if (!planSupportsSubjectCount(planId, subjectCount)) {
    const plan = BILLING_PLANS[planId];
    return { ok: false, message: `${plan.name} supports up to ${plan.maxSubjects} subjects.` };
  }

  if (!isStripeBillingConfigured()) {
    return { ok: false, message: "Checkout is not configured yet." };
  }

  if (planId === "individual") {
    const basePrice = priceId("STRIPE_PRICE_INDIVIDUAL_SUBJECT_ID");
    const additionalPrice = priceId("STRIPE_PRICE_ADDITIONAL_SUBJECT_ID");
    const extraSubjects = Math.max(0, subjectCount - 1);
    return {
      ok: true,
      lineItems: [
        { price: basePrice, quantity: 1 },
        ...(extraSubjects ? [{ price: additionalPrice, quantity: extraSubjects }] : []),
      ],
    };
  }

  const price = priceId(
    planId === "seven"
      ? "STRIPE_PRICE_UP_TO_SEVEN_SUBJECTS_ID"
      : "STRIPE_PRICE_UNLIMITED_SUBJECTS_ID",
  );
  return { ok: true, lineItems: [{ price, quantity: 1 }] };
}

export function planFromStripeSubscription(subscription: Stripe.Subscription): BillingPlanId | null {
  const priceIds = new Set(subscription.items.data.map((item) => item.price.id));
  if (priceIds.has(priceId("STRIPE_PRICE_UP_TO_SEVEN_SUBJECTS_ID"))) return "seven";
  if (priceIds.has(priceId("STRIPE_PRICE_UNLIMITED_SUBJECTS_ID"))) return "unlimited";
  if (priceIds.has(priceId("STRIPE_PRICE_INDIVIDUAL_SUBJECT_ID"))) return "individual";
  return null;
}

export function subjectCountFromStripeSubscription(subscription: Stripe.Subscription, planId: BillingPlanId | null) {
  if (planId !== "individual") return null;
  const additionalPrice = priceId("STRIPE_PRICE_ADDITIONAL_SUBJECT_ID");
  const additionalSubjects = subscription.items.data.find((item) => item.price.id === additionalPrice)?.quantity ?? 0;
  return Math.max(1, additionalSubjects + 1);
}
