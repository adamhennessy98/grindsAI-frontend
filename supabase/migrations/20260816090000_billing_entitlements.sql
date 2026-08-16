-- Billing fields are written only by the server-side Stripe webhook.
-- Student preference updates continue through security-definer RPCs.

alter table public.profiles
  add column if not exists subscription_plan text,
  add column if not exists stripe_subscription_id text,
  add column if not exists billing_subject_count integer,
  add column if not exists subscription_current_period_end timestamptz;

alter table public.profiles
  drop constraint if exists profiles_subscription_plan_check;

alter table public.profiles
  add constraint profiles_subscription_plan_check
  check (subscription_plan is null or subscription_plan in ('individual', 'seven', 'unlimited'));

alter table public.profiles
  drop constraint if exists profiles_billing_subject_count_check;

alter table public.profiles
  add constraint profiles_billing_subject_count_check
  check (billing_subject_count is null or billing_subject_count >= 1);

create unique index if not exists profiles_stripe_customer_id_unique
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists profiles_stripe_subscription_id_unique
  on public.profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- The old own-row policy allowed an authenticated user to set subscription_status directly.
-- Revoke direct writes; authenticated profile changes use upsert_student_prefs instead.
revoke insert, update on public.profiles from anon, authenticated;
