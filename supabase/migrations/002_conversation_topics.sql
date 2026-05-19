-- Adds topic-scoped chat threads. Existing conversations become general subject chats.

alter table public.conversations
  add column if not exists topic_id text not null default 'general',
  add column if not exists conversation_key text;

update public.conversations
set conversation_key = subject_id || ':' ||
  case when level = 'OL' then 'ordinary' else 'higher' end ||
  ':' || topic_id
where conversation_key is null;

alter table public.conversations
  alter column conversation_key set not null;

create index if not exists conversations_user_key_idx
  on public.conversations (user_id, conversation_key);
