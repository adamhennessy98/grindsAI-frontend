-- Short study sessions (FE-2006a Stage 01). Chat no longer reuses one forever thread per topic.

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_type text not null check (session_type in (
    'explain', 'topic_check', 'paste_question', 'test_me', 'exam_practice'
  )),
  subject_id text not null,
  level text not null check (level in ('HL', 'OL')),
  topic_id text not null default 'general',
  status text not null default 'active' check (status in ('active', 'ended')),
  conversation_id uuid references public.conversations (id) on delete set null,
  -- Stage 02 wrap-up fields (nullable until then)
  summary_line text,
  kc_ids text[] not null default '{}',
  graded_outcome text check (graded_outcome is null or graded_outcome in ('correct', 'incorrect', 'partial')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists study_sessions_user_active_idx
  on public.study_sessions (user_id, status, started_at desc);

create index if not exists study_sessions_user_topic_idx
  on public.study_sessions (user_id, subject_id, topic_id, started_at desc);

alter table public.study_sessions enable row level security;

drop policy if exists "study_sessions_select_own" on public.study_sessions;
create policy "study_sessions_select_own"
  on public.study_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "study_sessions_insert_own" on public.study_sessions;
create policy "study_sessions_insert_own"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "study_sessions_update_own" on public.study_sessions;
create policy "study_sessions_update_own"
  on public.study_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
