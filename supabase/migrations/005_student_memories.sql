-- Stores short, durable notes about a student learned from usage (chats, stuck moments, outcomes).
-- Used to enrich agent context over time without dumping full conversation history.

create table if not exists public.student_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text,
  topic_id text,
  level text,
  source text not null default 'chat'
    check (source = any (array['chat'::text, 'onboarding'::text, 'exam_tracker'::text, 'progress'::text, 'manual'::text])),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists student_memories_user_created_idx
  on public.student_memories (user_id, created_at desc);

create index if not exists student_memories_user_subject_idx
  on public.student_memories (user_id, subject_id, created_at desc);

alter table public.student_memories enable row level security;

drop policy if exists "student_memories_select_own" on public.student_memories;
create policy "student_memories_select_own"
  on public.student_memories for select
  using (auth.uid() = user_id);

drop policy if exists "student_memories_insert_own" on public.student_memories;
create policy "student_memories_insert_own"
  on public.student_memories for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_memories_update_own" on public.student_memories;
create policy "student_memories_update_own"
  on public.student_memories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "student_memories_delete_own" on public.student_memories;
create policy "student_memories_delete_own"
  on public.student_memories for delete
  using (auth.uid() = user_id);
