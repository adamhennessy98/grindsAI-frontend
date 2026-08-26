-- Database-backed limits for the two paid, model-backed endpoints.
-- auth.uid() is used inside the function so callers cannot choose another student.

create table if not exists public.student_api_rate_limits (
  user_id uuid not null references auth.users (id) on delete cascade,
  route text not null check (route in ('chat', 'exam-generator')),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  primary key (user_id, route)
);

alter table public.student_api_rate_limits enable row level security;
revoke all on public.student_api_rate_limits from anon, authenticated;

create or replace function public.consume_student_api_rate_limit(p_route text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_max_requests integer;
  v_window_seconds integer;
  v_bucket public.student_api_rate_limits%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  case p_route
    when 'chat' then
      v_max_requests := 30;
      v_window_seconds := 60;
    when 'exam-generator' then
      v_max_requests := 12;
      v_window_seconds := 300;
    else
      raise exception 'Unknown rate-limit route';
  end case;

  select * into v_bucket
  from public.student_api_rate_limits
  where user_id = v_user_id and route = p_route
  for update;

  if not found then
    insert into public.student_api_rate_limits (user_id, route, window_started_at, request_count)
    values (v_user_id, p_route, now(), 1)
    on conflict (user_id, route) do update
    set window_started_at = case
          when public.student_api_rate_limits.window_started_at <= now() - make_interval(secs => v_window_seconds) then now()
          else public.student_api_rate_limits.window_started_at
        end,
        request_count = case
          when public.student_api_rate_limits.window_started_at <= now() - make_interval(secs => v_window_seconds) then 1
          else public.student_api_rate_limits.request_count + 1
        end
    returning * into v_bucket;
    return v_bucket.request_count <= v_max_requests;
  end if;

  if v_bucket.window_started_at <= now() - make_interval(secs => v_window_seconds) then
    update public.student_api_rate_limits
    set window_started_at = now(), request_count = 1
    where user_id = v_user_id and route = p_route;
    return true;
  end if;

  if v_bucket.request_count >= v_max_requests then
    return false;
  end if;

  update public.student_api_rate_limits
  set request_count = request_count + 1
  where user_id = v_user_id and route = p_route;
  return true;
end;
$$;

grant execute on function public.consume_student_api_rate_limit(text) to authenticated;
