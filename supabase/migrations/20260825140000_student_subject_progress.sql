-- Durable, user-owned Progress & Results and Topic Check records.
-- The client accesses these only through authenticated API routes.

create table if not exists public.student_subject_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, subject_id),
  check (char_length(subject_id) between 1 and 80)
);

alter table public.student_subject_progress enable row level security;

drop policy if exists "student_subject_progress_select_own" on public.student_subject_progress;
create policy "student_subject_progress_select_own"
  on public.student_subject_progress for select
  using (auth.uid() = user_id);

drop policy if exists "student_subject_progress_insert_own" on public.student_subject_progress;
create policy "student_subject_progress_insert_own"
  on public.student_subject_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_subject_progress_update_own" on public.student_subject_progress;
create policy "student_subject_progress_update_own"
  on public.student_subject_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "student_subject_progress_delete_own" on public.student_subject_progress;
create policy "student_subject_progress_delete_own"
  on public.student_subject_progress for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.student_subject_progress to authenticated;
revoke all on public.student_subject_progress from anon;

create or replace function public.set_student_subject_progress_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists student_subject_progress_set_updated_at on public.student_subject_progress;
create trigger student_subject_progress_set_updated_at
  before update on public.student_subject_progress
  for each row execute function public.set_student_subject_progress_updated_at();
