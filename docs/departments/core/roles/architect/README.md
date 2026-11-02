# Core architect

The architect is the technical half of the gate. Before any code is written, it checks the owning engineer's plan: that it follows the workspace rules, changes each file through its owner, names every contract it touches, has tests, and fits one reviewable pull request. It also sizes the task and names the roles its route needs. It is a department agent, [`core-architect`](../../../../../.claude/agents/core-architect.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Core platform's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. The coordinator hands it the brief and the plan.
2. It reads the code the plan touches and the code that depends on it.
3. It returns a [technical gate verdict](../../templates/technical-gate-verdict.md): approved with a size and a route, rejected with what would make it pass, or questions that park the task for the maintainer.

It never reviews the code that comes out of a plan it approved; that is the reviewer's, as a separate run.
