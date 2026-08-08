-- Onboarding ends at Stage 2; per-subject optional quick check.

-- ── student_context: learner self-report style (tone only) ───────────────────
alter table public.student_context
  add column if not exists learner_style text;

alter table public.student_context
  drop constraint if exists student_context_learner_style_check;

alter table public.student_context
  add constraint student_context_learner_style_check
  check (
    learner_style is null
    or learner_style in (
      'numerical-logical',
      'language-writing',
      'content-memory',
      'none-natural'
    )
  );

-- ── learning_events: subject_diagnostic source ───────────────────────────────
alter table public.learning_events
  drop constraint if exists learning_events_source_check;

alter table public.learning_events
  add constraint learning_events_source_check
  check (
    source in (
      'tutor',
      'exam_gen',
      'archive',
      'system',
      'onboarding_diagnostic',
      'subject_diagnostic'
    )
  );

-- ── Per-subject quick-check status (shown once; skippable) ───────────────────
create table if not exists public.subject_diagnostic_status (
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text not null,
  status text not null check (status in ('completed', 'skipped')),
  updated_at timestamptz not null default now(),
  primary key (user_id, subject_id)
);

alter table public.subject_diagnostic_status enable row level security;

drop policy if exists "subject_diagnostic_status_select_own" on public.subject_diagnostic_status;
create policy "subject_diagnostic_status_select_own"
  on public.subject_diagnostic_status for select
  using (auth.uid() = user_id);

drop policy if exists "subject_diagnostic_status_insert_own" on public.subject_diagnostic_status;
create policy "subject_diagnostic_status_insert_own"
  on public.subject_diagnostic_status for insert
  with check (auth.uid() = user_id);

drop policy if exists "subject_diagnostic_status_update_own" on public.subject_diagnostic_status;
create policy "subject_diagnostic_status_update_own"
  on public.subject_diagnostic_status for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep RPC source allow-list in sync with learning_events
create or replace function public.record_learning_event(
  p_kc_id text,
  p_subject_id text,
  p_outcome text,
  p_source text,
  p_mastery_p double precision,
  p_p_l double precision,
  p_p_t double precision,
  p_p_g double precision,
  p_p_s double precision,
  p_evidence_n integer,
  p_chunk_id text default null,
  p_marks_earned numeric default null,
  p_marks_possible numeric default null,
  p_hint_depth integer default 0,
  p_scaffolded boolean default false,
  p_transfer_check boolean default false,
  p_error_type text default null,
  p_latency_ms integer default null,
  p_conversation_id uuid default null,
  p_message_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  v_attempt integer;
  v_event_id uuid;
  v_now timestamptz := now();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_outcome not in ('correct', 'incorrect', 'partial') then
    raise exception 'Invalid outcome';
  end if;

  if p_source not in (
    'tutor',
    'exam_gen',
    'archive',
    'system',
    'onboarding_diagnostic',
    'subject_diagnostic'
  ) then
    raise exception 'Invalid source';
  end if;

  if not exists (select 1 from public.knowledge_components where kc_id = p_kc_id) then
    raise exception 'Unknown kc_id';
  end if;

  select coalesce(count(*), 0)::integer + 1 into v_attempt
  from public.learning_events
  where user_id = uid and kc_id = p_kc_id;

  insert into public.learning_events (
    user_id,
    kc_id,
    subject_id,
    chunk_id,
    outcome,
    marks_earned,
    marks_possible,
    attempt_index_on_kc,
    hint_depth,
    scaffolded,
    transfer_check,
    error_type,
    latency_ms,
    source,
    conversation_id,
    message_id
  )
  values (
    uid,
    p_kc_id,
    p_subject_id,
    p_chunk_id,
    p_outcome,
    p_marks_earned,
    p_marks_possible,
    v_attempt,
    coalesce(p_hint_depth, 0),
    coalesce(p_scaffolded, false),
    coalesce(p_transfer_check, false),
    p_error_type,
    p_latency_ms,
    p_source,
    p_conversation_id,
    p_message_id
  )
  returning id into v_event_id;

  insert into public.student_kc_state (
    user_id,
    kc_id,
    mastery_p,
    p_l,
    p_t,
    p_g,
    p_s,
    evidence_n,
    last_event_at,
    last_outcome,
    updated_at
  )
  values (
    uid,
    p_kc_id,
    p_mastery_p,
    p_p_l,
    p_p_t,
    p_p_g,
    p_p_s,
    p_evidence_n,
    v_now,
    p_outcome,
    v_now
  )
  on conflict (user_id, kc_id) do update set
    mastery_p = excluded.mastery_p,
    p_l = excluded.p_l,
    p_t = excluded.p_t,
    p_g = excluded.p_g,
    p_s = excluded.p_s,
    evidence_n = excluded.evidence_n,
    last_event_at = excluded.last_event_at,
    last_outcome = excluded.last_outcome,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'eventId', v_event_id,
    'attemptIndexOnKc', v_attempt,
    'masteryP', p_mastery_p
  );
end;
$$;

revoke all on function public.record_learning_event(
  text, text, text, text,
  double precision, double precision, double precision, double precision, double precision, integer,
  text, numeric, numeric, integer, boolean, boolean, text, integer, uuid, uuid
) from public;
revoke all on function public.record_learning_event(
  text, text, text, text,
  double precision, double precision, double precision, double precision, double precision, integer,
  text, numeric, numeric, integer, boolean, boolean, text, integer, uuid, uuid
) from anon;
grant execute on function public.record_learning_event(
  text, text, text, text,
  double precision, double precision, double precision, double precision, double precision, integer,
  text, numeric, numeric, integer, boolean, boolean, text, integer, uuid, uuid
) to authenticated;
