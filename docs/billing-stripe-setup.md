# Stripe billing setup

GrindsAI's paywall is controlled on the server. Do not enable it until this checklist is complete.

1. Apply `supabase/migrations/20260816090000_billing_entitlements.sql` before deploying the code that uses it.
2. In Stripe, create four recurring monthly Prices in EUR:
   - first individual subject: €10
   - additional individual subject: €5
   - up to seven subjects: €25
   - unlimited subjects: €30
3. Add their Price IDs to `STRIPE_PRICE_INDIVIDUAL_SUBJECT_ID`, `STRIPE_PRICE_ADDITIONAL_SUBJECT_ID`, `STRIPE_PRICE_UP_TO_SEVEN_SUBJECTS_ID`, and `STRIPE_PRICE_UNLIMITED_SUBJECTS_ID`.
4. Create a Stripe webhook pointing to `/api/webhooks/stripe` and subscribe it to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET` and a restricted Stripe secret key as `STRIPE_SECRET_KEY`.
6. Configure Stripe's Customer Portal for cancellation and, if desired, switching between the three plans. The app redirects active subscribers there from Pricing.
7. In production, set `BILLING_ENFORCEMENT=true` and set `BILLING_PRIVILEGED_EMAILS` for any internal accounts that should never be billed.

Local development keeps `adamhennessey98@gmail.com` and `clancyontree@gmail.com` exempt when the gate is enabled. Those defaults do not apply in production; production exemptions must be explicitly configured in `BILLING_PRIVILEGED_EMAILS`.

The individual-subject plan charges one €10 base Price plus the €5 Price for each extra selected subject at checkout. It is capped at four selected subjects, after which the seven-subject plan is the appropriate option. The paid subject count is recorded at checkout, so students cannot add extra paid subjects without updating their Stripe subscription.
