# Core platform rules

Rules for every Core platform role, on top of [the handbook](../RULES.md). What Core platform does is in [`README.md`](README.md).

## What to judge against

- The workspace rules under [`.claude/rules/`](../../../.claude/rules), the handbook, and the book's account of the code: [the platform](../../02-platform/00-platform.md), [DevOps](../../03-devops/00-devops.md) and [libraries](../../04-libraries/00-libraries.md) chapters. Where the book and the code disagree, the code is what runs; report the page to the coordinator for the writer.
- Judge against the rules as they are written. A rule you think is wrong is a note for the coordinator, never a reason to pass or fail a change.

## Contracts

- The public surface of a package is what its `exports` and `src/main.ts` expose. Changing it, adding a unit kind, changing the lifecycle order or changing what `velnora.config.ts` accepts is a contract change: the plan says so and names every package that consumes it.
- A contract change the issue didn't ask for goes to the maintainer before the gate approves it.
- The two generations stay apart. A plan that makes the current generation import an older package, or revives an older package, needs the maintainer's say.

## Only the task

- Plan, build and review only what the brief asks. Something else you notice goes to the coordinator in a line after your output.
