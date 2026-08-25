# Product backlog

Scratch pad for ideas, bugs, and features. Add items under the right section when you think of them. Agents: check here before inventing work; don’t treat unchecked items as “do now” unless asked.

**Last updated:** 2026-08-21

---

## Bugfixes

- [ ] Response time is very slow (tutor / generation feels laggy — profile chat + exam-gen + RAG paths)
- [ ] Get rid of AI-generated emojis (tutor / exam-gen copy — clean that tone up)

---

## New features

- [x] **FE-2006a — Session architecture** (replace “one long chat per subtopic”) — **ICM:** [`docs/icm/session-architecture/`](./icm/session-architecture/CONTEXT.md); Stages 01–05 done 2026-08-21 (confirm `student_exam_schedule` migration on hosted)
  - **Kill the infinite-thread-per-subtopic design.** Replace with short, purpose-built sessions (minutes, not hours) — one session per task type: Test Me, Explain This, Topic Check, Paste a Question, etc.
  - Each session has a defined **start** (pulled from current `student_kc_state`, not asked of the student), a **body**, and an **end** (student finishes, hits a natural stopping point, or goes idle).
  - A single “sitting” in the app = multiple short sessions back to back, not one continuous session.

  - **Session wrap-up (the write path).** On session end, run a constrained wrap-up step that extracts structured outcomes:
    - which knowledge components (KCs) were touched
    - whether there was a real graded attempt and its result
    - a one-line plain-English summary
    - anything to push into `kc_check_queue`
  - Only this structured output gets written to `learning_events` / `student_kc_state`. The raw chat transcript is never re-read by the system to infer mastery — enforces the existing “self-reported data must never seed mastery scores” rule.

  - **Resuming / “Continue”.** “Continue” (e.g. the Recommended Next Step card) reads structured state (`student_kc_state`, last session summary, `kc_check_queue`), never replays old chat history into context.
  - This also flattens cost — each session starts with a small, deliberate context payload instead of a growing thread.

  - **Archived chats.** Add an “Archived Chats” view under each subtopic. List items show the session’s wrap-up summary (not raw transcript) and are tagged by KC, so students (and parents) can scan/filter rather than reopening full transcripts.

  - **Exam-date-aware orchestration.** New input: student-entered exam calendar (subject, date, and paper/level if relevant) — new table, e.g. `student_exam_schedule`.
  - “Recommended Next Step” logic becomes weakness (from `student_kc_state` / `kc_check_queue`) combined with urgency (from exam calendar) — e.g. a simple weighted score to start, tunable later.
  - Guidance stays **gentle/suggestive only** — surfaced via the recommendation card and possibly a small badge (e.g. “Exam in 12 days”) on the subject list. No gating, no blocked flows, no forced paths. Full free access to all four actions at all times.

  - **Scope-control principle for productivity-adjacent features.** Test for any new feature: does its success metric move because the student’s real mastery data improves, or independently of it (time-in-app, days-opened, generic engagement)?
    - Downstream-of-mastery features (spaced review prompts for decaying KCs, “what to study next” queue, session goals tied to `kc_check_queue`) pass and are worth building.
    - Anything whose metric is independent of actual mastery / graded-attempt data should be scrutinized before adding, regardless of how cheap it is to build.

- [ ] **Authoritative advice sourcing** in the RAG content pipeline (~70/30 weighting)
  - **Tier 1 (primary, ~70%):** Ingest SEC Chief Examiner Reports, official marking schemes, and NCCA specs directly; tag by subject / year / knowledge-component. This is ground truth for what earns marks — no quality filtering needed.
  - **Tier 2 (secondary, ~30%):** Short hand-curated list of experienced teachers/tutors for study-technique colour and framing that examiner reports don’t cover. Credibility judged **once per source** by a human reviewer, not per piece of content.
  - **Do not** build an LLM “quality filter” for open/trending content — subjective quality judgment is unreliable. The LLM’s job is to verify grounding against Tier 1 (same citation/retrieval work planned in RAG remediation).
  - **New source tags:** `examiner_report`, `vetted_teacher`
  - **Ship first:** single-subject pilot (20–30 tips sourced only from that subject’s Chief Examiner reports), then expand to Tier 2 / more subjects

---

## Ideas / later

_(drop half-formed thoughts here)_
