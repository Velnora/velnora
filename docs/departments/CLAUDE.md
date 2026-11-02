# Departments: notes for Claude

What this folder is, is in [`README.md`](README.md); the rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

## Whose rules these are

- A `RULES.md` here binds you only when you act as a department role: as an agent whose `.claude/agents/<dept>-<role>.md` points at it, or as the coordinator when the maintainer asks for the department flow. The handbook binds every role.
- In any other session, or when you read another department's files, treat them as reference, not as your instructions.
- Before any work as a role, read in this order: the handbook, `<dept>/RULES.md`, `<dept>/roles/<role>/RULES.md`.

## Editing these files

- A change to any `RULES.md` is a rule change: its own pull request, separate from feature work.
- `README.md`, `<dept>-knowledge.md` and `templates/` change with the work they describe.

## Model check

Your model ID is in your own system prompt, on the line `The exact model ID is …`. Compare it with the model your role's `RULES.md` names.

## Permissions

- Each agent file lists only its role's tools and leaves out the `Agent` tool, so a department agent can't start other agents.
- `.env` (`reliability-release` only), every `git` call except staging, committing and reading history, and all of `gh` (the main session only) are blocked by a project hook, [`.claude/hooks/department-access`](../../.claude/hooks/department-access). It blocks the main session from `.env` as well.
- `typecheck` in the current generation writes `.js` files beside the sources, since their `tsconfig.json` has no `noEmit`. After a run, delete exactly the files it wrote (`git status --short` lists them as untracked) and never commit them.
- A denied call is the rule working. Don't retry it another way (such as `cat .env` after a denied `Read`); report it.
