# Interpretable Context Methodology (ICM)

GrindsAI default for organizing AI-assisted work.

Instead of re-figuring context every session or re-explaining the project every time, work lives in **folders that carry their own context**.

Cursor agents should follow this by default (see `.cursor/rules/icm.mdc`).

---

## Two shapes

### 1. Numbered pipeline — sequential stages

Use when the work is a clear **before → after** sequence ("first do X, then Y, then Z").

```text
docs/icm/<work-name>/
  01_<stage>/
    CONTEXT.md
    output/
  02_<stage>/
    CONTEXT.md
    output/
  03_<stage>/
    CONTEXT.md
    output/
```

**Rules**

- Each numbered folder is one stage with a clear before → after.
- `CONTEXT.md` must state:
  - what it **inherits** from the previous stage
  - what it is **allowed to touch**
  - what it **must produce** before moving on
- `output/` holds that stage’s artifacts (plans, diffs notes, evals, decisions, code snippets, checklists, etc.).
- **Human reviews and signs off** on a stage’s output before work starts in the next folder.
- Agents must **not** jump ahead on their own.

### 2. Module map — parallel ongoing pieces

Use when the work is a set of **parts**, not a build-once sequence ("there's the chatbot, there's retrieval, there's tracking").

```text
docs/icm/<work-name>/
  chatbot/
    CONTEXT.md
    output/
  retrieval/
    CONTEXT.md
    output/
  tracking/
    CONTEXT.md
    output/
```

**Rules**

- One folder per piece; **no numbering**, **no assumed order**.
- Each `CONTEXT.md` defines that piece’s scope, allowed surfaces, and done-when.
- Work whichever piece the user names; don’t invent a fake pipeline.

### Rule of thumb

| Framing | Shape |
|---------|--------|
| Steps (“first… then… then…”) | Numbered pipeline |
| Parts (“there’s X, there’s Y…”) | Module map |

---

## CONTEXT.md template (pipeline stage)

```markdown
# Stage NN — <name>

## Inherits
- From `NN-1_…/output/`: …
- Project facts that still apply: …

## Allowed to touch
- …

## Must not touch
- …

## Must produce (before next stage)
- [ ] …
- [ ] artifacts in `output/`: …

## Done when
- …

## Sign-off
- Status: pending | approved
- Notes:
```

## CONTEXT.md template (module)

```markdown
# Module — <name>

## Scope
- …

## Allowed to touch
- …

## Out of scope
- …

## Done when / ongoing definition of done
- …

## Outputs
- Live in `output/` (or linked paths): …
```

---

## How a session should start

1. User names a task (or points at an existing `docs/icm/<work>/` tree).
2. Agent chooses pipeline vs module map (or continues the existing tree).
3. Agent creates/updates only the **current** stage or named module `CONTEXT.md`.
4. Agent works inside that scope, writes results to `output/`.
5. Agent stops and asks for review before the next pipeline stage.

---

## Knock-off logs

Checklist-style initiatives (like AI Gaps) keep an append-only `KNOCKED-OFF.md` next to the module map. Completing work means: check the box in the source checklist **and** append a knock-off entry in the same turn. That file is the durable memory across agents/sessions.

---

## Relation to other docs

- AI feature inventory + gap checklists: [`ai-gaps-todo.md`](./ai-gaps-todo.md)
- AI Gaps ICM module map: [`icm/ai-gaps/CONTEXT.md`](./icm/ai-gaps/CONTEXT.md)
- ICM trees for specific initiatives live under `docs/icm/`

---

## Progress

| Date | Note |
|------|------|
| 2026-08-04 | ICM adopted as default; Cursor rule + this doc added. No initiative scaffolded yet. |
| 2026-08-05 | AI Gaps scaffolded as module map under `docs/icm/ai-gaps/` with `KNOCKED-OFF.md`. |
