# Decisions — student data & onboarding (2026-08-06)

Signed off by user (yes to recommended calls).

## The rule

Three buckets. Never mix them.

1. **Prefs** — who they are (year, subjects, levels, sitting, challenge, grade band, reason).
2. **Mastery** — what they know (only real answers on KC-tagged questions).
3. **Student context** — how to talk to them (anxiety, etc.).

## Onboarding

| Stage | What | Where it goes | Done? |
|-------|------|---------------|-------|
| 1 | Year, subjects, level, exam sitting | Prefs only | No |
| 2 | Challenge (keep) + target grade band + optional reason | Prefs only — never mastery | No |
| 3 | 2–3 diagnostic Qs per subject, strand-spread, KC-tagged, no hints | `learning_events` with `source: onboarding_diagnostic` | **Yes — onboarding complete** |

## Anytime free-text

Student can say anything. AI may extract:

- Topics → **check queue** (separate table) = “ask a real question soon”
- Tone → **student_context**

Nothing from this box goes straight into mastery tables. Only their answer on a real question updates mastery.

## BKT early evidence

- Few attempts on a KC → each answer moves the score more; as history grows, each new answer moves it less.
- Diagnostic attempts count less than real tutor sessions.
- No separate “first two weeks” calendar rule for now.

## Gap 1 job under this model

Feed the tutor three clean channels: prefs (framing), student context (tone), mastery summary (what to practise). Do not let Stage 2 or free-text look like proof of ability.
