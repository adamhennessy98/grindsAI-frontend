# Module — Vector RAG (Gap 2)

## Scope

Either **activate** hybrid/useful vector retrieval (OpenAI embeddings + Supabase `match_exam_chunks`) alongside local keyword RAG, or **deliberately retire** the dead path so it doesn’t rot. Includes resolving the shadowed Applied Maths branch in `retrieve.ts`.

## Source checklist

[`docs/ai-gaps-todo.md`](../../../ai-gaps-todo.md) — section **Gap 2**

## Allowed to touch

- `src/lib/retrieve.ts`
- `src/lib/exam-question-chunks.ts` / `processed-subjects.ts` / `curriculum-context.ts` as needed
- `.env.example`, Supabase-related notes/migrations if activating
- `package.json` only if removing or requiring `openai`
- This module’s `output/` + parent `KNOCKED-OFF.md` + checklist boxes in `ai-gaps-todo.md`

## Out of scope

- Onboarding personalisation wiring (→ `onboarding-personalisation`)
- Anthropic tool-calling agent loop (→ `tools-agents`)
- Unrelated tutor UI refactors

## Done when

A recorded decision (activate **or** retire) is in `KNOCKED-OFF.md` / `output/`, and the matching Gap 2 checklist path is fully `[x]`.

## Status

- State: **not started** — **decision required first** (Option A hybrid / B vector-first / C retire)
- Blockers: product/ops choice on strategy

## Outputs

Live in `output/` (decision ADR, eval notes, smoke-script notes, PR links).
