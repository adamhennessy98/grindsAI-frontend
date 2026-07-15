-- Adds study/onboarding fields to profiles so agents can load student context server-side.

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists year_group text,
  add column if not exists exam_target text,
  add column if not exists challenge text,
  add column if not exists subjects jsonb not null default '[]'::jsonb,
  add column if not exists subject_levels jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
