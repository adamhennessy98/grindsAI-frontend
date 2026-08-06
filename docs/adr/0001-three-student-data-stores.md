# Three student data stores (prefs / mastery / context)

Signup and tutoring must not mix “who they are,” “what they know,” and “how to talk to them.” We keep three stores: prefs on `profiles`, mastery via `learning_events` → BKT → `student_kc_state`, and tone/life signals in `student_context`. Self-report and free-text never write mastery; free-text may only enqueue a separate check-queue row or update student context. Onboarding is complete only after Stage 3 (diagnostic). Early BKT treats low evidence and `onboarding_diagnostic` as weaker than later tutor attempts — no calendar “first two weeks” rule for now.

## Consequences

- Gap 1 composes three channels into the tutor prompt without cross-contaminating them.
- `challenge` stays on prefs for tone; Stage 2 also adds target grade band + optional reason.
- Check queue is its own table, not a fake learning event.
- `learning_events.source` must allow `onboarding_diagnostic`.
