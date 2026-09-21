-- Free trial access, independent of Stripe. Written only by trusted server-side
-- jobs (service role), same as the other billing columns on profiles.

alter table public.profiles
  add column if not exists trial_ends_at timestamptz;
