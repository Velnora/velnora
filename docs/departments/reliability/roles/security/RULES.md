# Reliability security rules

Rules for the security role, on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md). What it does is in [`README.md`](README.md).

## Model and tools

- **Model:** Opus (a `claude-opus-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Bash`, as [its agent file](../../../../../.claude/agents/reliability-security.md) lists.

## Read only

- Never create, edit or delete a file in the repository, and never commit. `Bash` is for read-only checks: `yarn npm audit`, `yarn npm info`, and packing a package into your scratchpad to list what it would publish.
- Your output is your reply to the coordinator, which carries your handoff for the coordinator to write.

## What to check

- **Input:** request paths, headers and bodies, and file paths built from them, are checked before use. A path never escapes the directory it is meant to serve.
- **Execution:** Velnora loads only the user's own config and code, from where the docs say it does. Nothing is evaluated from a request.
- **Dependencies:** each new or upgraded dependency is needed, maintained, and has no known advisory at the installed version.
- **Publish surface:** a package publishes its build output and the files it declares, never sources, specs, configs or local files.
- **Secrets:** no secret in code, tests, logs, docs or a handoff.

## Judgment

- Judge security only. A design question the change raises goes to the architect through the coordinator.
- A risk you can't settle from the code, such as whether a dev server may ever be exposed beyond `localhost`, goes to the maintainer with a recommendation.
