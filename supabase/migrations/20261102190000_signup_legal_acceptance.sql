-- Run after 20260829113000_legal_acceptance_audit.sql.
-- Capture the signup checkbox at account creation using the database clock.
-- Later edits to user_metadata never create acceptance records.
grant select on public.legal_acceptances to authenticated;

create or replace function public.capture_signup_legal_acceptance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.raw_user_meta_data ->> 'legal_document_version' = '2026-08-29'
    and new.raw_user_meta_data -> 'legal_documents_accepted' = 'true'::jsonb then
    insert into public.legal_acceptances (user_id, document_key, document_version, source)
    values
      (new.id, 'terms', '2026-08-29', 'signup'),
      (new.id, 'privacy', '2026-08-29', 'signup'),
      (new.id, 'consent', '2026-08-29', 'signup')
    on conflict (user_id, document_key, document_version) do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.capture_signup_legal_acceptance() from public, anon, authenticated;

drop trigger if exists on_auth_user_legal_acceptance on auth.users;
create trigger on_auth_user_legal_acceptance
  after insert on auth.users
  for each row execute function public.capture_signup_legal_acceptance();
