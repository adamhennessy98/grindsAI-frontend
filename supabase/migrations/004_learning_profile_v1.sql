-- Gap 5: persistent learning profile — prefs, KC catalog, events, BKT state.

-- ── Prefs on profiles ───────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists year_group text,
  add column if not exists exam_target text,
  add column if not exists challenge text,
  add column if not exists subjects text[] not null default '{}',
  add column if not exists subject_levels jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;

-- ── Knowledge components ────────────────────────────────────────────────────
create table if not exists public.knowledge_components (
  kc_id text primary key,
  subject_id text not null,
  strand_topic_id text not null,
  label text not null,
  level text not null default 'HL',
  source text not null default 'strand_seed',
  created_at timestamptz not null default now()
);

alter table public.knowledge_components enable row level security;

drop policy if exists "knowledge_components_select_authenticated" on public.knowledge_components;
create policy "knowledge_components_select_authenticated"
  on public.knowledge_components for select
  to authenticated
  using (true);

create table if not exists public.chunk_kcs (
  chunk_id text not null,
  kc_id text not null references public.knowledge_components (kc_id) on delete cascade,
  primary key (chunk_id, kc_id)
);

create index if not exists chunk_kcs_kc_idx on public.chunk_kcs (kc_id);

alter table public.chunk_kcs enable row level security;

drop policy if exists "chunk_kcs_select_authenticated" on public.chunk_kcs;
create policy "chunk_kcs_select_authenticated"
  on public.chunk_kcs for select
  to authenticated
  using (true);

-- ── Learning events (append-only) ───────────────────────────────────────────
create table if not exists public.learning_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kc_id text not null references public.knowledge_components (kc_id),
  subject_id text not null,
  chunk_id text,
  outcome text not null check (outcome in ('correct', 'incorrect', 'partial')),
  marks_earned numeric,
  marks_possible numeric,
  attempt_index_on_kc integer not null default 1,
  hint_depth integer not null default 0,
  scaffolded boolean not null default false,
  transfer_check boolean not null default false,
  error_type text,
  latency_ms integer,
  source text not null check (source in ('tutor', 'exam_gen', 'archive', 'system')),
  conversation_id uuid,
  message_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists learning_events_user_kc_created_idx
  on public.learning_events (user_id, kc_id, created_at);

create index if not exists learning_events_user_created_idx
  on public.learning_events (user_id, created_at desc);

alter table public.learning_events enable row level security;

drop policy if exists "learning_events_select_own" on public.learning_events;
create policy "learning_events_select_own"
  on public.learning_events for select
  using (auth.uid() = user_id);

drop policy if exists "learning_events_insert_own" on public.learning_events;
create policy "learning_events_insert_own"
  on public.learning_events for insert
  with check (auth.uid() = user_id);

-- ── Derived KC mastery state ────────────────────────────────────────────────
create table if not exists public.student_kc_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  kc_id text not null references public.knowledge_components (kc_id) on delete cascade,
  mastery_p double precision not null default 0.0,
  p_l double precision not null default 0.0,
  p_t double precision not null default 0.1,
  p_g double precision not null default 0.2,
  p_s double precision not null default 0.1,
  evidence_n integer not null default 0,
  last_event_at timestamptz,
  last_outcome text,
  updated_at timestamptz not null default now(),
  primary key (user_id, kc_id)
);

alter table public.student_kc_state enable row level security;

drop policy if exists "student_kc_state_select_own" on public.student_kc_state;
create policy "student_kc_state_select_own"
  on public.student_kc_state for select
  using (auth.uid() = user_id);

drop policy if exists "student_kc_state_insert_own" on public.student_kc_state;
create policy "student_kc_state_insert_own"
  on public.student_kc_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_kc_state_update_own" on public.student_kc_state;
create policy "student_kc_state_update_own"
  on public.student_kc_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Prefs RPC (study columns only; never touches billing) ───────────────────
create or replace function public.upsert_student_prefs(
  p_year_group text,
  p_exam_target text,
  p_challenge text,
  p_subjects text[],
  p_subject_levels jsonb,
  p_completed_at timestamptz default now()
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
    p_completed_at,
    now()
  )
  on conflict (id) do update set
    year_group = excluded.year_group,
    exam_target = excluded.exam_target,
    challenge = excluded.challenge,
    subjects = excluded.subjects,
    subject_levels = excluded.subject_levels,
    onboarding_completed_at = excluded.onboarding_completed_at,
    updated_at = now()
  returning * into row;

  return row;
end;
$$;

revoke all on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz) from public;
revoke all on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz) from anon;
grant execute on function public.upsert_student_prefs(text, text, text, text[], jsonb, timestamptz) to authenticated;

-- ── Maths HL strand KC seed ─────────────────────────────────────────────────
insert into public.knowledge_components (kc_id, subject_id, strand_topic_id, label, level, source)
values
  ('maths.hl.algebra', 'maths', 'algebra', 'Algebra', 'HL', 'strand_seed'),
  ('maths.hl.functions-graphs', 'maths', 'functions-graphs', 'Functions & Graphs', 'HL', 'strand_seed'),
  ('maths.hl.calculus', 'maths', 'calculus', 'Calculus', 'HL', 'strand_seed'),
  ('maths.hl.sequences-series', 'maths', 'sequences-series', 'Sequences & Series', 'HL', 'strand_seed'),
  ('maths.hl.complex-numbers', 'maths', 'complex-numbers', 'Complex Numbers', 'HL', 'strand_seed'),
  ('maths.hl.financial-maths', 'maths', 'financial-maths', 'Financial Maths', 'HL', 'strand_seed'),
  ('maths.hl.coordinate-geometry', 'maths', 'coordinate-geometry', 'Coordinate Geometry', 'HL', 'strand_seed'),
  ('maths.hl.geometry-proofs', 'maths', 'geometry-proofs', 'Geometry & Proofs', 'HL', 'strand_seed'),
  ('maths.hl.trigonometry', 'maths', 'trigonometry', 'Trigonometry', 'HL', 'strand_seed'),
  ('maths.hl.probability', 'maths', 'probability', 'Probability', 'HL', 'strand_seed'),
  ('maths.hl.statistics', 'maths', 'statistics', 'Statistics', 'HL', 'strand_seed'),
  ('maths.hl.area-volume-measurement', 'maths', 'area-volume-measurement', 'Area, Volume & Measurement', 'HL', 'strand_seed'),
  ('maths.hl.general', 'maths', 'general', 'General Maths', 'HL', 'strand_seed')
on conflict (kc_id) do update set
  label = excluded.label,
  strand_topic_id = excluded.strand_topic_id,
  source = excluded.source;
