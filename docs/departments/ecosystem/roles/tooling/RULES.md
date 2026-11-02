# Ecosystem tooling rules

Rules for the tooling role, on top of [Ecosystem's](../../RULES.md) and [the handbook](../../../RULES.md). What it does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/ecosystem-tooling.md) lists.

## Files

- Yours: `libs/cli`, `packages/cli`, `libs/helper/*`, `libs/generator`, `libs/devkit`, `libs/velnora` and `examples/*`, apart from their build and tool configs.
- Read [`typescript.md`](../../../../../.claude/rules/code-style/typescript.md) on every task, and [`zod.md`](../../../../../.claude/rules/code-style/zod.md) when the change touches a Zod schema.

## Commands

- A command's name, options, defaults and output are what users script against. Change them only as the plan names, with a changeset.
- Every command you change is run for real in your report, with its exact arguments and output, on the example workspace or a temporary one you delete afterwards.
- The example workspace is evidence for every department. Change it only as the plan says, and keep it running on defaults unless the plan adds a config.
