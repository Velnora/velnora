# Ecosystem integrations

The integrations role builds what connects an app's own framework to Velnora: the React and Nest integrations, the micro-frontend placeholder, the Vite integration, and the adapters that serve requests, such as h3. It plans from the brief, implements the approved plan with its unit tests, shows it working on a real project, and in a fresh run reviews another run's work on its packages. It is a department agent, [`ecosystem-integrations`](../../../../../.claude/agents/ecosystem-integrations.md), started by the coordinator. Its rules are in [`RULES.md`](RULES.md), on top of [Ecosystem's](../../RULES.md) and [the handbook](../../../RULES.md).

## How it works

1. **Plan:** it reads the brief, the engine contracts it builds on, and the framework's own API at the installed version, and returns an [implementation plan](../../../core/templates/implementation-plan.md).
2. **Implement:** with the approved plan, it changes its packages, writes their specs, runs them against a real project, and commits.
3. **Owner review:** a new run reviews the commits and returns an [owner review](../../../core/templates/owner-review.md).

When the engine lacks what an integration needs, it returns a [contract request](../../templates/contract-request.md) instead of working around it.
