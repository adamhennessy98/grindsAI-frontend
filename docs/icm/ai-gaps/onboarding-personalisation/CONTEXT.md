# Module — Onboarding personalisation (Gap 1)

## Scope

Compose **three** tutor channels without mixing them: prefs (framing), student context (tone), mastery summary (what to practise). Keep papers → tutor handoff `studentContext` working. Do not invent schema here — read what `learning-profile` provides.

North-star rules: [`docs/learning/CONTEXT.md`](../../../../learning/CONTEXT.md), [`docs/adr/0001-three-student-data-stores.md`](../../../../adr/0001-three-student-data-stores.md), [`../learning-profile/output/DECISIONS-2026-08-06.md`](../learning-profile/output/DECISIONS-2026-08-06.md).

## Source checklist

[`docs/ai-gaps-todo.md`](../../../ai-gaps-todo.md) — section **Gap 1**

## Allowed to touch

- `src/lib/onboarding.ts`
- `src/lib/llm.ts` (`buildSystemPrompt` / context composition)
- `src/app/api/chat/route.ts`
- `src/components/app/conversation-view.tsx`
- `src/components/app/question-tutor-panel.tsx`
- Optionally exam-generator path if v1 decision includes it
- This module’s `output/` + parent `KNOCKED-OFF.md` + checklist boxes in `ai-gaps-todo.md`

## Out of scope

- Designing/persisting schema for Stage 3 diagnostic, check queue, `student_context`, BKT weighting (→ `learning-profile`)
- Vector RAG / embeddings (→ `vector-rag`)
- Tool calling / agents (→ `tools-agents`)
- Deleting/refactoring `generateTutorReply` for its own sake (→ `tutor-reply-cleanup`) unless needed as a shared helper for this gap

## Depends on / pairs with

- **Gap 5 / learning-profile** for durable prefs + mastery read helper; Stage 2/3 fields and `student_context` may land there first.
- Short-term Gap 1 can still personalise from existing prefs (`challenge`, year, subjects) while the rest ships.

## Done when

All Gap 1 checklist items in `ai-gaps-todo.md` are `[x]`, and matching entries exist in `../KNOCKED-OFF.md`. Tutor prompt respects the three-store rule.

## Status

- State: **v1 implemented** (server compose of prefs + tone + mastery + handoff)
- Decisions: chat-only personalisation for v1 (exam gen deferred); merge order prefs → tone → mastery → handoff; incomplete profile → chat still works
- Remaining: manual QA checklist; optional exam-gen wire; unit test for compose (no test runner yet)
- Blockers: none

## Outputs

Live in `output/` (decisions, compose-helper design, QA notes, PR links).
