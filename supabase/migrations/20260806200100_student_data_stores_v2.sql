-- Three-store model v2: Stage 2 prefs, diagnostic source, student_context, check queue.

-- ── Prefs: Stage 2 fields ───────────────────────────────────────────────────
alter table public.profiles
  add column if not exists target_grade_band text,
  add column if not exists reason_for_using text;

-- ── learning_events: allow onboarding_diagnostic ────────────────────────────
alter table public.learning_events
  drop constraint if exists learning_events_source_check;

alter table public.learning_events
  add constraint learning_events_source_check
  check (source in ('tutor', 'exam_gen', 'archive', 'system', 'onboarding_diagnostic'));

-- ── Student context (tone only — never mastery) ─────────────────────────────
create table if not exists public.student_context (
  user_id uuid primary key references auth.users (id) on delete cascade,
  anxiety_flag boolean not null default false,
  notes jsonb not null default '[]'::jsonb,
  raw_free_text text,
  updated_at timestamptz not null default now()
);

alter table public.student_context enable row level security;

drop policy if exists "student_context_select_own" on public.student_context;
create policy "student_context_select_own"
  on public.student_context for select
  using (auth.uid() = user_id);

drop policy if exists "student_context_insert_own" on public.student_context;
create policy "student_context_insert_own"
  on public.student_context for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_context_update_own" on public.student_context;
create policy "student_context_update_own"
  on public.student_context for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Check queue (flagged topics — not mastery evidence) ─────────────────────
create table if not exists public.kc_check_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kc_id text not null references public.knowledge_components (kc_id),
  subject_id text not null,
  reason text,
  source text not null default 'free_text' check (source in ('free_text', 'system')),
  status text not null default 'pending' check (status in ('pending', 'asked', 'done', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kc_check_queue_user_status_idx
  on public.kc_check_queue (user_id, status, created_at desc);

alter table public.kc_check_queue enable row level security;

drop policy if exists "kc_check_queue_select_own" on public.kc_check_queue;
create policy "kc_check_queue_select_own"
  on public.kc_check_queue for select
  using (auth.uid() = user_id);

drop policy if exists "kc_check_queue_insert_own" on public.kc_check_queue;
create policy "kc_check_queue_insert_own"
  on public.kc_check_queue for insert
  with check (auth.uid() = user_id);

drop policy if exists "kc_check_queue_update_own" on public.kc_check_queue;
create policy "kc_check_queue_update_own"
  on public.kc_check_queue for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Prefs RPC (study columns only; completed_at optional) ───────────────────
create or replace function public.upsert_student_prefs(
  p_year_group text,
  p_exam_target text,
  p_challenge text,
  p_subjects text[],
  p_subject_levels jsonb,
  p_completed_at timestamptz default null,
  p_target_grade_band text default null,
  p_reason_for_using text default null,
  p_mark_complete boolean default false
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  row public.profiles;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (
    id,
    year_group,
    exam_target,
    challenge,
    subjects,
    subject_levels,
    target_grade_band,
    reason_for_using,
    onboarding_completed_at,
    updated_at
  )
  values (
    uid,
    p_year_group,
    p_exam_target,
    p_challenge,
    coalesce(p_subjects, '{}'),
    coalesce(p_subject_levels, '{}'::jsonb),
    p_target_grade_band,
    p_reason_for_using,
    case when p_mark_complete then coalesce(p_completed_at, now()) else null end,
    now()
  )
  on conflict (id) do update set
    year_group = excluded.year_group,
    exam_target = excluded.exam_target,
    challenge = coalesce(excluded.challenge, public.profiles.challenge),
    subjects = excluded.subjects,
    subject_levels = excluded.subject_levels,
    target_grade_band = coalesce(excluded.target_grade_band, public.profiles.target_grade_band),
    reason_for_using = coalesce(excluded.reason_for_using, public.profiles.reason_for_using),
    onboarding_completed_at = case
      when p_mark_complete then coalesce(p_completed_at, now())
      else public.profiles.onboarding_completed_at
    end,
    updated_at = now()
  returning * into row;

  return row;
end;
$$;

revoke all on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz, text, text, boolean) from public;
revoke all on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz, text, text, boolean) from anon;
grant execute on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz, text, text, boolean) to authenticated;

-- Drop old 6-arg overload if present (from 004)
drop function if exists public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz);

-- ── General KCs for non-maths subjects (diagnostic tagging) ─────────────────
insert into public.knowledge_components (kc_id, subject_id, strand_topic_id, label, level, source)
values
  ('applied-maths.hl.general', 'applied-maths', 'general', 'Applied Maths (general)', 'HL', 'strand_seed'),
  ('physics.hl.general', 'physics', 'general', 'Physics (general)', 'HL', 'strand_seed'),
  ('chemistry.hl.general', 'chemistry', 'general', 'Chemistry (general)', 'HL', 'strand_seed'),
  ('biology.hl.general', 'biology', 'general', 'Biology (general)', 'HL', 'strand_seed'),
  ('english.hl.general', 'english', 'general', 'English (general)', 'HL', 'strand_seed'),
  ('irish.hl.general', 'irish', 'general', 'Irish (general)', 'HL', 'strand_seed'),
  ('french.hl.general', 'french', 'general', 'French (general)', 'HL', 'strand_seed'),
  ('history.hl.general', 'history', 'general', 'History (general)', 'HL', 'strand_seed'),
  ('geography.hl.general', 'geography', 'general', 'Geography (general)', 'HL', 'strand_seed'),
  ('business.hl.general', 'business', 'general', 'Business (general)', 'HL', 'strand_seed'),
  ('accounting.hl.general', 'accounting', 'general', 'Accounting (general)', 'HL', 'strand_seed'),
  ('economics.hl.general', 'economics', 'general', 'Economics (general)', 'HL', 'strand_seed'),
  ('computer-science.hl.general', 'computer-science', 'general', 'Computer Science (general)', 'HL', 'strand_seed'),
  ('german.hl.general', 'german', 'general', 'German (general)', 'HL', 'strand_seed'),
  ('spanish.hl.general', 'spanish', 'general', 'Spanish (general)', 'HL', 'strand_seed'),
  ('technology.hl.general', 'technology', 'general', 'Technology (general)', 'HL', 'strand_seed')
on conflict (kc_id) do update set
  label = excluded.label,
  strand_topic_id = excluded.strand_topic_id,
  source = excluded.source;
