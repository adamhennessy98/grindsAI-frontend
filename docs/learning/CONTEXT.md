# Learning (student data)

How GrindsAI thinks about a student: who they are, what they know, and how to talk to them. These three ideas stay separate.

## Language

**Prefs**:
Who the student is for the product — year, subjects, level per subject, exam sitting, challenge, target grade band, optional reason for using GrindsAI. Stored on `profiles`. Never used as proof of what they know.
_Avoid_: Profile-as-mastery, ability inference from signup

**Mastery**:
What the student can do on a knowledge component, estimated only from real graded attempts. Lives in `learning_events` (raw attempts) and `student_kc_state` (BKT summary).
_Avoid_: Self-report as mastery, chat text as mastery

**Student context**:
Tone and life signals that change how the tutor speaks — e.g. test anxiety, “nobody explained fractions.” Stored in `student_context`. Never writes mastery.
_Avoid_: Putting tone flags on `profiles` or in `learning_events`

**Knowledge component (KC)**:
A teachable skill unit tied to the past-paper / marking-scheme taxonomy (not a coarse strand label alone).

**Learning event**:
One append-only attempt row: KC-tagged, outcome, source, scaffold flags. Only attempt evidence belongs here.

**Check queue**:
Topics flagged from free-text as “worth a quick real check soon.” Separate table. A queue entry does not change mastery; only the student’s answer on a real question does.

**Onboarding Stage 1**:
Fast scoping form (year, subjects, level, exam sitting) → prefs metadata only.

**Onboarding Stage 2**:
Goals / self-report (keep challenge; add target grade band; optional reason) → prefs only. Never seeds mastery.

**Onboarding Stage 3**:
Light diagnostic: every selected subject, 2–3 questions, spread across strands, each tagged with a KC, `source: onboarding_diagnostic`, no hints/scaffolding. Completing Stage 3 marks onboarding complete.

**Free-text note**:
Anytime box where the student can say anything not captured elsewhere. An extractor may propose check-queue items and student-context tone flags — never mastery writes.
