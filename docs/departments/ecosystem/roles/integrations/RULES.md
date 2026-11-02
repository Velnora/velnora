# Ecosystem integrations rules

Rules for the integrations role, on top of [Ecosystem's](../../RULES.md) and [the handbook](../../../RULES.md). What it does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/ecosystem-integrations.md) lists.

## Files

- Yours: `libs/integrations/*`, `libs/vite/integration` and `libs/unit/adapter/*`, apart from their build and tool configs.
- Read [`typescript.md`](../../../../../.claude/rules/code-style/typescript.md) and [`vite.md`](../../../../../.claude/rules/vite.md) on every task.

## Frameworks

- A framework the integration supports is a peer dependency, with the version range the integration was tested against.
- Never call a framework API you haven't found in its installed types. A framework's documentation for another major version is not evidence.
- An adapter declares what it exposes as a unit, the way `@velnora/adapter-h3` does, so the kernel can find it by query.
