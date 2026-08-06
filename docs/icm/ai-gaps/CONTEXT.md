# ICM — AI Gaps

**Shape:** module map (five ongoing pieces, not a forced sequence)  
**Source checklist:** [`docs/ai-gaps-todo.md`](../../ai-gaps-todo.md)  
**Knocked-off memory:** [`KNOCKED-OFF.md`](./KNOCKED-OFF.md) ← durable log of everything completed

Suggested pick order (not a pipeline gate): Gap 5 → Gap 1 → Gap 4 → Gap 2 → Gap 3. Work whichever module you name.

---

## Modules

| Module | Folder | Gap |
|--------|--------|-----|
| Persistent learning profile | [`learning-profile/`](./learning-profile/) | Gap 5 |
| Onboarding personalisation | [`onboarding-personalisation/`](./onboarding-personalisation/) | Gap 1 |
| Vector RAG | [`vector-rag/`](./vector-rag/) | Gap 2 |
| Tools / agents | [`tools-agents/`](./tools-agents/) | Gap 3 |
| Tutor reply cleanup | [`tutor-reply-cleanup/`](./tutor-reply-cleanup/) | Gap 4 |

---

## Knock-off system (how memory works)

When a checklist item (or whole subsection) is finished:

1. **Check it off** in `docs/ai-gaps-todo.md` (`- [ ]` → `- [x]`).
2. **Append** a dated entry to [`KNOCKED-OFF.md`](./KNOCKED-OFF.md) (never delete old entries).
3. **Drop artifacts** for that work in the module’s `output/` (decisions, notes, PR links, evals).
4. **Update** that module’s `CONTEXT.md` status if the module is done or blocked.

Agents must do steps 1–2 in the **same turn** as completing the work. If only a decision was made (no code), still log it under `KNOCKED-OFF.md` as a decision.

### Entry template for `KNOCKED-OFF.md`

```markdown
### YYYY-MM-DD — <module-id> — <short title>
- **Checklist ref:** Gap N / section / item text
- **What changed:** …
- **Where:** paths, PR, commit
- **Artifacts:** `module/output/…` or none
- **Signed off by:** <name or pending>
```

---

## Session protocol

1. Read this file + `KNOCKED-OFF.md` + the named module’s `CONTEXT.md`.
2. Skim the matching section in `ai-gaps-todo.md` for open `- [ ]` items.
3. Work only that module’s allowed surfaces (unless CONTEXT is updated with agreement).
4. On finish of any bite-sized piece: update checklist + append knock-off + write `output/` as needed.
5. Stop and ask before starting a different module unless the user named more than one.
