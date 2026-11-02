# Core engineer rules

Rules for the engineer, on top of [Core platform's](../../RULES.md) and [the handbook](../../../RULES.md), whose "Writing code" section binds this role. What the engineer does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/core-engineer.md) lists.

## Files

- Yours: `libs/kernel`, `libs/host`, `libs/types`, `libs/utils`, `libs/unit/runtime/*`, `libs/runtime/*`, `libs/router`, `libs/rpc`, `libs/contracts`, `libs/plugin-api` and `libs/core`, apart from their build and tool configs.
- Read [`typescript.md`](../../../../../.claude/rules/code-style/typescript.md) and, when the change touches a Vite config or Vite API, [`vite.md`](../../../../../.claude/rules/vite.md).

## The engine

- Keep the lifecycle's order and its hooks as they are unless the plan changes them by name.
- A new unit kind, a new registry entry or a change to `BaseContext` is a contract change: plan it with every unit that uses it.
- When you add a dependency between engine packages, add it to the importing package's `package.json`, so the imports the book lists as missing don't grow.
