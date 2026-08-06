# Module — Persistent learning profile (Gap 5)

## Scope

Turn “user profile” into a real Supabase-backed learning record: persist onboarding prefs server-side, capture study signals from tutor/exam/progress use, and eventually derive strengths/weaknesses that can steer teaching. Today Supabase `profiles` is billing-only; onboarding + study state are browser-local.

## Source checklist

[`docs/ai-gaps-todo.md`](../../../ai-gaps-todo.md) — section **Gap 5**

## Allowed to touch

- `supabase/migrations/*` (new migration via `supabase migration new …`)
- `public.profiles` columns / related study tables + RLS
- `src/lib/onboarding.ts` and onboarding UI save/load paths
- `src/components/app/study-state.ts` and writers in chat/papers/progress
- APIs that should read server profile for tutoring (coordinate with `onboarding-personalisation`)
- This module’s `output/` + parent `KNOCKED-OFF.md` + checklist boxes in `ai-gaps-todo.md`

## Out of scope

- Feeding profile into the LLM prompt (→ `onboarding-personalisation`) except ensuring a server-readable source exists
- Vector RAG / tools / `generateTutorReply` cleanup

## Done when

Onboarding + core study signals persist in Supabase with RLS; refresh/new device still has the student’s study picture; Gap 5 checklist items for the agreed phase are `[x]` and logged in `KNOCKED-OFF.md`.

## Pipeline (Gap 5 is staged)

| Stage | Folder | Purpose |
|-------|--------|---------|
| 01 Plan | [`01_plan/`](./01_plan/) | Decisions + signal model — **current (rev 3)** |
| 02 Prefs schema | `02_prefs_schema/` | Onboarding columns + RLS (Phase 1) |
| 03 KC spine | `03_kc_spine/` | Maths HL KC + chunk maps from MS |
| 04 Event log | `04_event_log/` | Append-only attempt events |
| 05 Emitters + BKT | `05_emitters_bkt/` | Write events; derived mastery state |
| 06 Read helper | `06_read_helper/` | Prefs + weak KCs for Gap 1 (no LLM wiring) |

Do not start a later stage until the previous stage’s `CONTEXT.md` sign-off is approved.

## Status

- State: **v1 implemented** (prefs + Maths HL KC seed + events + BKT + emitters + read helper)
- Hosted: migration `learning_profile_v1` on project `wlotlyialknuevlcjmzm`
- **2026-08-06 decisions:** three stores + 3-stage onboarding (complete after Stage 3) — see [`output/DECISIONS-2026-08-06.md`](./output/DECISIONS-2026-08-06.md), [`docs/learning/CONTEXT.md`](../../../learning/CONTEXT.md), [`docs/adr/0001-three-student-data-stores.md`](../../../adr/0001-three-student-data-stores.md)
- Remaining next builds: Stage 2 fields; Stage 3 diagnostic + `onboarding_diagnostic` source; `student_context`; check queue; BKT early-evidence weighting; then Gap 1 three-channel compose
- Plan artifact: [`01_plan/output/PLAN.md`](./01_plan/output/PLAN.md)
- Build log: [`output/BUILD_LOG.md`](./output/BUILD_LOG.md)
