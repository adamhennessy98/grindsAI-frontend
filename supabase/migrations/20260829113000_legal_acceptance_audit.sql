-- Versioned, append-only evidence that an authenticated account accepted the
-- current public Terms, Privacy Policy and Consent/Cookies information.
-- Update LEGAL_DOCUMENT_VERSION here and in src/lib/legal-consent.ts together.

create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_key text not null check (document_key in ('terms', 'privacy', 'consent')),
  document_version text not null,
  accepted_at timestamptz not null default now(),
  source text not null check (source in ('signup', 'reacceptance')),
  unique (user_id, document_key, document_version)
);

create index if not exists legal_acceptances_user_document_idx
  on public.legal_acceptances (user_id, document_key, document_version);

alter table public.legal_acceptances enable row level security;

revoke all on public.legal_acceptances from anon, authenticated;

drop policy if exists "legal_acceptances_select_own" on public.legal_acceptances;
create policy "legal_acceptances_select_own"
  on public.legal_acceptances for select
  using (auth.uid() = user_id);

create or replace function public.record_current_legal_acceptance(
  p_source text default 'signup'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_source not in ('signup', 'reacceptance') then
    raise exception 'Invalid legal acceptance source';
  end if;

  insert into public.legal_acceptances (user_id, document_key, document_version, source)
  values
    (uid, 'terms', '2026-08-29', p_source),
    (uid, 'privacy', '2026-08-29', p_source),
    (uid, 'consent', '2026-08-29', p_source)
  on conflict (user_id, document_key, document_version) do nothing;
end;
$$;

create or replace function public.has_current_legal_acceptance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and not exists (
      select 1
      from (values
        ('terms'::text, '2026-08-29'::text),
        ('privacy'::text, '2026-08-29'::text),
        ('consent'::text, '2026-08-29'::text)
      ) as required(document_key, document_version)
      where not exists (
        select 1
        from public.legal_acceptances accepted
        where accepted.user_id = auth.uid()
          and accepted.document_key = required.document_key
          and accepted.document_version = required.document_version
      )
    );
$$;

revoke all on function public.record_current_legal_acceptance(text) from public;
revoke all on function public.record_current_legal_acceptance(text) from anon;
grant execute on function public.record_current_legal_acceptance(text) to authenticated;

revoke all on function public.has_current_legal_acceptance() from public;
revoke all on function public.has_current_legal_acceptance() from anon;
grant execute on function public.has_current_legal_acceptance() to authenticated;
