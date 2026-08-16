import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isBillingPlanId } from "@/lib/billing-plans";
import { getStripe } from "@/lib/stripe";
import { planFromStripeSubscription, subjectCountFromStripeSubscription } from "@/lib/stripe-plans";
import { createAdminClient } from "@/lib/supabase/admin";

function stripeId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  return typeof value === "string" ? value : value?.id ?? null;
}

function subjectCount(value: string | undefined) {
  const count = Number(value);
  return Number.isInteger(count) && count > 0 ? count : null;
}

async function userIdForSubscription(
  admin: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
) {
  const metadataUserId = subscription.metadata.userId;
  if (metadataUserId) return metadataUserId;

  const customerId = stripeId(subscription.customer);
  if (!customerId) return null;
  const { data, error } = await admin.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Service role not configured." }, { status: 503 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      if (userId && session.mode === "subscription") {
        const planId = isBillingPlanId(session.metadata?.planId) ? session.metadata.planId : null;
        const { error } = await admin.from("profiles").upsert(
          {
            id: userId,
            email: session.customer_details?.email ?? session.customer_email ?? undefined,
            stripe_customer_id: stripeId(session.customer),
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            subscription_plan: planId,
            billing_subject_count: planId === "individual" ? subjectCount(session.metadata?.subjectCount) : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
        if (error) throw error;
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await userIdForSubscription(admin, subscription);
      if (userId) {
        const planId = planFromStripeSubscription(subscription) ?? (isBillingPlanId(subscription.metadata.planId) ? subscription.metadata.planId : null);
        const { error } = await admin
          .from("profiles")
          .update({
            stripe_customer_id: stripeId(subscription.customer),
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            ...(planId ? { subscription_plan: planId } : {}),
            ...(planId ? { billing_subject_count: subjectCountFromStripeSubscription(subscription, planId) } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        if (error) throw error;
      }
    }
  } catch (error) {
    console.error("[stripe-webhook] profile sync failed:", error);
    return NextResponse.json({ error: "Could not process billing event." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
