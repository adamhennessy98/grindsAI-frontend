# Stage 01 — Plan Gap 5 (persistent learning profile)

## Inherits

- Module scope from [`../CONTEXT.md`](../CONTEXT.md)
- Audit findings in [`docs/ai-gaps-todo.md`](../../../../ai-gaps-todo.md) Gap 5
- Current schema: billing-only `profiles`; onboarding in localStorage; study-state in memory

## Allowed to touch

- `docs/icm/ai-gaps/learning-profile/**` only (this stage)
- May update parent module `CONTEXT.md` status / pointers
- **Must not** change `src/**` or `supabase/migrations/**` in this stage

## Must produce (before next stage)

- [x] Written plan in `output/PLAN.md`
- [x] Rev 2: KC spine before heavy telemetry
- [x] Rev 3: high-signal attempt events + derived BKT state; explicit noise denylist
- [ ] User sign-off on recommended decisions (or explicit overrides)

## Done when

User approves the plan (or marks amendments). Then Phase 1 prefs schema may start; KC spine before learning emitters.

## Sign-off

- Status: **approved** (2026-08-05)
- Notes: Continuous build (delivery B) + apply hosted Supabase. Signal model rev 3. Execution logged in `../output/BUILD_LOG.md`.
