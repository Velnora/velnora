# Product coordinator

The coordinator is the main Claude session. It takes a task in, finds its job, picks the route, starts each role's agent with an assignment, and carries the result back into Git and GitHub. It is the only role that creates branches, pushes, opens pull requests or runs `gh`, and the only one that talks to the maintainer. It has no agent file. Its rules are in [`RULES.md`](RULES.md), on top of [Product's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. It reads the issue on GitHub, or takes the maintainer's request from chat, and finds the job it belongs to under `docs/handoffs/`.
2. It picks the route the work needs, from the full flow in [the overview](../../../README.md#flow) down to a single step.
3. For each step it starts the role's agent with an [assignment](../../templates/assignment.md), checks what comes back, and writes the handoff of any role that can't write files.
4. After the gate it creates the task branch. At the end it pushes it and opens the pull request with [its description](../../templates/pr-description.md).
5. It posts on the issue and moves the board item only as far as the maintainer has authorised, and never merges.

It also keeps the department rules: a rule change is a pull request of its own, checked by the core reviewer before the maintainer sees it.
