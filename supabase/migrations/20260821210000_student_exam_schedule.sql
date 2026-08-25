-- Student-entered exam calendar (FE-2006a Stage 05). One date per subject for v1.

create table if not exists public.student_exam_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text not null,
  exam_date date not null,
  paper_label text,
  level text check (level is null or level in ('HL', 'OL')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, subject_id)
);

create index if not exists student_exam_schedule_user_idx
  on public.student_exam_schedule (user_id, exam_date);

alter table public.student_exam_schedule enable row level security;

drop policy if exists "student_exam_schedule_select_own" on public.student_exam_schedule;
create policy "student_exam_schedule_select_own"
  on public.student_exam_schedule for select
  using (auth.uid() = user_id);

drop policy if exists "student_exam_schedule_insert_own" on public.student_exam_schedule;
create policy "student_exam_schedule_insert_own"
  on public.student_exam_schedule for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_exam_schedule_update_own" on public.student_exam_schedule;
create policy "student_exam_schedule_update_own"
  on public.student_exam_schedule for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "student_exam_schedule_delete_own" on public.student_exam_schedule;
create policy "student_exam_schedule_delete_own"
  on public.student_exam_schedule for delete
  using (auth.uid() = user_id);
