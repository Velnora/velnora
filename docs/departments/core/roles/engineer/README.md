# Core engineer

The engineer builds the engine: the kernel, the host, the runtime units and the server and client runtimes, and the shared `types`, `utils` and contract packages, in both generations. It plans a change from the brief, implements the plan the gate approved with its unit tests, and in a fresh run reviews another run's work on its packages. It is a department agent, [`core-engineer`](../../../../../.claude/agents/core-engineer.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Core platform's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. **Plan:** it reads the brief and the code, and returns an [implementation plan](../../templates/implementation-plan.md) for the gate.
2. **Implement:** with the approved plan, it changes its packages, writes their specs, runs the checks, and commits.
3. **Owner review:** a new run reviews the commits against the plan and returns an [owner review](../../templates/owner-review.md).

When an Ecosystem role needs a capability the engine doesn't offer, the engineer designs the contract for it, through a plan the architect gates like any other.
