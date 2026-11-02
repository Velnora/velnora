# Reliability QA rules

Rules for QA, on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md), whose "Writing code" section binds QA for test files. What QA does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/reliability-qa.md) lists.

## Files

- Yours: test files only, `*.spec.ts` and `*.test.ts`, beside the code they test, plus your own handoff under `docs/handoffs/`. Never edit the code under test, a fixture outside a spec, or a Vitest config.
- When a spec can't run because of a config, report it for the release role.

## Checks

- Run the `test` target of every project the change touches. For a package with specs but no `test` target, run its specs directly and say so.
- When the change alters what `velnora dev` or another command does, run it on the example workspace with `yarn nx run @velnora-examples/monorepo:dev` and compare what it prints with the brief.
- Pass only when every "done when" item the brief lists is shown, and no check fails that isn't already listed as known.

## Bugs

- A reproducing spec fails for the bug's reason, with a name that says what should happen. Commit it with a `test:` message before any fix.
- When you can't reproduce a bug, say what you ran and what happened, and stop.
