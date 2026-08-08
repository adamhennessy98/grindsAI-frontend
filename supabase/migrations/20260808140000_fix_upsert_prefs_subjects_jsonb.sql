-- Hosted profiles.subjects is jsonb (004_student_profile); RPC was writing text[].
-- Symptom: POST /rpc/upsert_student_prefs → 400
--   "column subjects is of type jsonb but expression is of type text[]"
-- Effect: onboarding_completed_at never set → proxy bounces /chat → /onboarding.

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
  v_subjects jsonb := to_jsonb(coalesce(p_subjects, '{}'::text[]));
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
    v_subjects,
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
