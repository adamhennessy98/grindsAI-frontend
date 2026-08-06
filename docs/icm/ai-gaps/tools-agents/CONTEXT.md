# Module — Tools / agents (Gap 3)

## Scope

Add the smallest useful tool set for the LC tutor beyond single-shot prompts, without breaking Socratic behaviour. Phased: design → architecture → implement → QA.

## Source checklist

[`docs/ai-gaps-todo.md`](../../../ai-gaps-todo.md) — section **Gap 3**

## Allowed to touch

- `src/lib/llm.ts` and chat API route
- Tool executors wrapping formula-book / chunks / curriculum libs
- Conversation UI for optional tool-status chips
- Dependencies only after architecture decision (Anthropic tools vs Vercel AI SDK)
- This module’s `output/` + parent `KNOCKED-OFF.md` + checklist boxes in `ai-gaps-todo.md`

## Out of scope

- Activating vector RAG as a substitute for tools (coordinate with `vector-rag` if tools call retrieval)
- Onboarding prompt wiring except consuming already-composed student context
- Large product redesign unrelated to tools

## Done when

Agreed Phase 1+ shipped (or explicitly deferred phases logged), Gap 3 checklist items for those phases are `[x]`, knock-off entries exist.

## Status

- State: **not started** — design-first
- Blockers: prefer Gap 1 + Gap 4 prompt-path cleanup first (suggested, not a hard ICM gate)

## Outputs

Live in `output/` (tool list decisions, architecture choice, latency notes, PR links).
