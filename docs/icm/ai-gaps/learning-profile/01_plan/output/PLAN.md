# Gap 5 plan — Persistent learning profile

**Status:** draft revised — awaiting sign-off  
**Date:** 2026-08-05 (rev 3 — high-signal event log + derived mastery state)  
**ICM:** `learning-profile/01_plan`  
**Authority for signals:** this doc (rev 3). UI study-state mirroring is **not** the learning model.

---

## Problem (one sentence)

We want a durable student learning record that steers teaching — without hoarding noisy UI telemetry or treating raw chat as the source of truth.

## Two product layers (don’t conflate)

| Layer | Purpose | Ship |
|-------|---------|------|
| **Prefs** | Who they are (year, subjects, HL/OL, exam, challenge prior) | Early — unblocks Gap 1 tone |
| **Learning model** | What they can do per knowledge component | After KC spine — event log + derived state |

---

## High-signal, low-noise — **collect these**

Every attempt-level record should be structured and **KC-tagged**. Prefer marking-scheme–aligned KCs over coarse strand topics.

| Signal | Why it matters | Notes for us |
|--------|----------------|--------------|
| **Outcome per attempt on a KC** | `correct` / `incorrect` / `partial` | Partial is critical for MS-graded subjects (e.g. 3/7 ≠ 0/7 — method vs algebra). Store marks earned/possible when known. |
| **Attempt number on that KC before success** | First-try correct ≠ correct after 3 hints | Same final outcome, different mastery state |
| **Hint / scaffold depth** | How many Socratic nudges before unaided success | **Most proprietary** signal — static platforms can’t get this |
| **Independent transfer check** | Later similar item, same KC, **without** scaffolding | Real mastery confirmation — not the original scaffolded solve |
| **Error type** (not just wrong) | Careless slip vs conceptual misunderstanding → different remediation | LLM may **propose** class; only trust against a **human-audited eval set** — don’t let the model self-evaluate unchecked |
| **Recency / decay per KC** | October mastery ≠ May confidence | Weight in derived state, not a separate vanity metric |
| **Response latency** | Secondary / tiebreaker only | Fast wrong → guess?; slow correct → fragile? Modifier only — latency alone is noisy |

## Low-signal / noise — **don’t weight; usually don’t store**

| Noise | Why avoid |
|-------|-----------|
| Raw UI clickstream (scroll, mouse, tab switches) | Doesn’t feed BKT/IRT; data-minimization risk for minors |
| Self-reported confidence **alone** | Anxious LC students miscalibrated; only useful as confidence-vs-outcome gap |
| Session length / login streaks as mastery input | Retention ≠ competence |
| Time-of-day / device / browser | No mastery signal |
| Unstructured chat transcript as **primary** record | Valuable dialogue → parse into structured events; otherwise every query needs another LLM pass (black box again) |

**Implication:** keep `messages` for the product/UX; the **learning record** is the event log + derived state, not the transcript.

---

## Practical structure (canonical)

```text
append-only event log          derived state (per student × KC)
─────────────────────          ───────────────────────────────
attempt-level rows             mastery probability (e.g. BKT)
KC id, outcome, hint depth,    updated after each event
error type, timestamp, …       replayable from the log
```

### Event log (minimal, structured, append-only)

Suggested fields (names TBD in schema stage):

| Field | Required | Purpose |
|-------|----------|---------|
| `id`, `user_id`, `created_at` | yes | identity |
| `kc_id` | **yes** | atomic skill unit |
| `subject_id` | yes | convenience / RLS queries |
| `chunk_id` / paper ref | preferred | link to MS corpus item |
| `outcome` | yes | `correct` \| `incorrect` \| `partial` |
| `marks_earned`, `marks_possible` | when known | partial credit fidelity |
| `attempt_index_on_kc` | yes | attempts before success |
| `hint_depth` | yes | Socratic nudge count this attempt |
| `scaffolded` | yes | was scaffolding present |
| `transfer_check` | yes/default false | independent later item? |
| `error_type` | when incorrect/partial | enum from audited set; nullable if unknown |
| `latency_ms` | optional | secondary only |
| `source` | yes | `tutor` \| `exam_gen` \| `archive` \| … |
| `conversation_id` / `message_id` | optional | traceability — not the feature store |

**Do not** put essays, clickstreams, or full transcripts in this table.

### Derived state table (per student × KC)

| Field | Purpose |
|-------|---------|
| `user_id`, `kc_id` | identity |
| `mastery_p` (or BKT params: `p_l0`, `p_t`, `p_g`, `p_s`, …) | model state |
| `evidence_n` | event count |
| `last_event_at` | recency / decay |
| `last_outcome` | quick UX |
| `updated_at` | |

**Rule:** the mastery model gets richer over time (better BKT params, decay, transfer weighting). The **event log stays lean** so you can replay a new parameterization without re-touching raw interaction data — and so eval/audit stays tractable.

### Prefs (separate, early)

On `profiles`: year, subjects, levels, exam target, challenge (prior only), `onboarding_completed_at`. Not inputs to BKT except as priors/filters.

---

## Foundation: KC taxonomy before telemetry volume

Strand tags (`calculus`) are navigation, not KCs.

Unlock = past papers + **marking schemes** → human-auditable KC list + chunk↔KC maps.

- Pilot: **Maths HL** (richest processed MS corpus).
- Error-type enum: define small closed set; LLM classify only against **human-audited eval**; ship `unknown` until trusted.

Without KC ids, most “high-signal” rows above cannot be written honestly — so don’t fake them with free-text topics.

---

## Delivery phases

| Phase | Deliverable | Depends on |
|-------|-------------|------------|
| **0** | Verify hosted `profiles` | — |
| **1 — Prefs** | Onboarding columns + RLS; sync save/load; cookie cache | 0 |
| **2 — KC spine** | Maths HL KC catalog + chunk↔KC from MS | 1 optional (can parallel after plan sign-off) |
| **3 — Event log schema** | Append-only `learning_events` (fields above); **no** clickstream | 2 |
| **4 — Emitters** | Tutor/archive/exam paths write events (outcome, hint depth, attempt index, transfer when detectable) | 3 |
| **5 — Derived state + BKT** | `student_kc_state` updated from events; decay; replayable | 3–4 |
| **6 — Read helper** | Prefs + top weak KCs / mastery for Gap 1 | 1 for prefs; 5 for weak-KC teaching |
| **Later** | Error-type classifier + eval set; more subjects; confidence-vs-outcome if ever useful | 5 |

**Dropped from earlier drafts:** persisting UI `StudyActivity` / free-text results as the learning profile; bulk activity firehose.

---

## Gap 1 relationship

| Gap 1 can use | When |
|---------------|------|
| Prefs (year, challenge, subjects) | After Phase 1 |
| “Drill these KCs” / mastery-aware tutoring | After Phase 5–6 |

Don’t wait for BKT to personalise *tone*; do wait for events+state to personalise *skill selection*.

---

## Data minimization (minors)

- Collect only fields in the high-signal table.
- No clickstream, device, or session-streak tables for mastery.
- Transcripts remain product data under existing chat retention; not duplicated into the learning feature store.
- Error-type / any LLM labeling: audited pipeline, not silent self-grade.

---

## Open decisions for sign-off

1. Adopt this **event log + derived BKT state** split as canonical?  
2. Phase 1 prefs next for implementation, with KC spine as the critical path for learning signals?  
3. Maths HL KC pilot first?  
4. Gap 1 after prefs only (tone), then revisit when weak-KC summary exists?  
5. Partial credit: store `marks_earned` / `marks_possible` whenever MS context exists — yes?

---

## Sign-off checklist (you)

- [ ] High-signal list / noise list accepted
- [ ] Event log + derived state (not transcript-as-record) accepted
- [ ] Prefs early; KC before emitters accepted
- [ ] Pilot subject: _______________
- [ ] Gap 1 timing: prefs-only first / wait for mastery: _______________

**Amendments:** _(add here when reviewing)_
