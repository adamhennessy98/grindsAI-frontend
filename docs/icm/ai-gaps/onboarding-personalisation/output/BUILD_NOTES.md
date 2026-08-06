# Build notes — 2026-08-06 three-store + Gap 1

## Shipped

- Migration `student_data_stores_v2` applied on hosted grindsAI
- Stage 1–3 onboarding UI (complete only after diagnostic)
- `onboarding_diagnostic` events + weighted BKT
- `student_context` + `kc_check_queue` + free-text API/UI
- `/api/chat` composes prefs / tone / struggling KCs / handoff server-side

## Manual QA to run

1. New signup → finish Stages 1–3 → cookie set → land in chat
2. Ask a normal question → reply should reflect year/challenge tone
3. Papers “Ask tutor” → question still in context + personalisation
4. Home “Tell your tutor something” with anxiety/fractions → tone row + check queue, no mastery write from text alone
5. Edit `/onboarding?edit=1` → next chat turn picks up prefs

## Deferred

- Exam generator personalisation
- Automated unit test for `composeStudentContext`
- Richer diagnostic bank from past-paper archive (maths still uses MC bank)
