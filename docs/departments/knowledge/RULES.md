# Developer knowledge rules

Rules for every Developer knowledge role, on top of [the handbook](../RULES.md). What Developer knowledge does is in [`README.md`](README.md).

## Verified behaviour

- Every statement about what Velnora does comes from the code on the task branch, read or run. An article, an old handoff, an issue or a role's report is a lead to check, never the source.
- Design intent is written as intent, saying it isn't built yet. A page never presents a plan as behaviour.
- Known problems stay visible: in the page they affect and in [`STATUS.md`](../../../STATUS.md).

## The book

- Follow [docs.md](../../../.claude/rules/docs.md) for the book's layout and page rules, and [markdown.md](../../../.claude/rules/markdown.md) for tables.
- Run `yarn nx run docs:check` after every change under `docs/`, and commit only when it passes. `yarn nx run docs:check:fix` aligns tables.

## Scope

- Change only `docs/` (apart from `departments/`, `handoffs/` and `templates/`), `STATUS.md`, the root `README.md` and the package READMEs, plus your own handoff under `docs/handoffs/`.
- When the code and a page disagree and the task doesn't settle which is right, ask the owning role through the coordinator. Never change the code to match a page.
