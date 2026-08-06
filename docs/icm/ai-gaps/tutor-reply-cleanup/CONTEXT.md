# Module — Tutor reply cleanup (Gap 4)

## Scope

Deal with dead `generateTutorReply()` in `src/lib/llm.ts`: delete it, refactor a shared core with `streamTutorReply()`, or give it a real caller — so prompt/RAG setup doesn’t drift.

## Source checklist

[`docs/ai-gaps-todo.md`](../../../ai-gaps-todo.md) — section **Gap 4**

## Allowed to touch

- `src/lib/llm.ts`
- Call sites only if introducing a real non-stream consumer
- Tests / small scripts if added for eval
- This module’s `output/` + parent `KNOCKED-OFF.md` + checklist boxes in `ai-gaps-todo.md`

## Out of scope

- Personalisation copy (→ `onboarding-personalisation`) except sharing a compose helper if refactor lands first
- Retrieval strategy (→ `vector-rag`)
- Tool calling (→ `tools-agents`)

## Done when

Decision A/B/C executed; Gap 4 checklist `[x]`; knock-off entry recorded; streaming chat still works with and without `ANTHROPIC_API_KEY`.

## Status

- State: **not started** — **decision required** (A delete / B refactor shared core / C real consumer)
- Blockers: none recorded

## Outputs

Live in `output/` (decision, before/after notes, PR links).
