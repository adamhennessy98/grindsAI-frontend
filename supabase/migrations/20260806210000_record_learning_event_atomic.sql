-- Atomic learning event + KC state write; close direct client forge path.

-- ── RPC: insert event + upsert state in one transaction ─────────────────────
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

  if p_source not in ('tutor', 'exam_gen', 'archive', 'system', 'onboarding_diagnostic') then
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

-- Client must not forge mastery via PostgREST; writes go through the RPC only.
drop policy if exists "learning_events_insert_own" on public.learning_events;
drop policy if exists "student_kc_state_insert_own" on public.student_kc_state;
drop policy if exists "student_kc_state_update_own" on public.student_kc_state;
