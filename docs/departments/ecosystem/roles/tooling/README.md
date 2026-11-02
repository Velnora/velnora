# Ecosystem tooling

The tooling role builds what a developer types and runs: the `velnora` CLI and its commands, the command helpers, the workspace generator, the devkit, the `velnora` facade package, and the example workspace. It plans from the brief, implements the approved plan with its unit tests, runs the commands it changed against a real workspace, and in a fresh run reviews another run's work on its packages. It is a department agent, [`ecosystem-tooling`](../../../../../.claude/agents/ecosystem-tooling.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Ecosystem's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. **Plan:** it reads the brief and the commands it touches, and returns an [implementation plan](../../../core/templates/implementation-plan.md).
2. **Implement:** with the approved plan, it changes its packages, writes their specs, runs the changed commands, and commits.
3. **Owner review:** a new run reviews the commits and returns an [owner review](../../../core/templates/owner-review.md).

The workspace's own generator, `@velnora/internal:package`, is not this role's: it builds Velnora's packages and belongs to the release role.
