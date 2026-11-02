# Ecosystem

The ecosystem department owns the path from a real project into Velnora: the framework integrations and adapters that plug into the engine, and the CLI, generator and examples a developer actually touches. Its work is done when a representative project runs through the commands it claims to support, not when a plugin registers. It builds on Core platform's contracts and never reaches past them.

How it fits with the other departments is in [the overview](../README.md). Its rules are in [`RULES.md`](RULES.md), on top of [the handbook](../RULES.md).

## Roles

| Role                                         | Model  | Does                                                                                                   |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| [integrations](roles/integrations/README.md) | Sonnet | The React and Nest integrations, the micro-frontend placeholder, the Vite integration and the adapters |
| [tooling](roles/tooling/README.md)           | Sonnet | The CLI and its commands, the generator, the devkit, the `velnora` facade and the examples             |

## What it gets and gives

- **In:** the brief for a plan, the approved plan for an implementation, or another run's commits for an owner review.
- **Out:** an [implementation plan](../core/templates/implementation-plan.md), commits, or an [owner review](../core/templates/owner-review.md). When the engine lacks a capability the work needs, a [contract request](templates/contract-request.md) for Core platform.

## Files

- [`ecosystem-knowledge.md`](ecosystem-knowledge.md): the state of each integration and tool, and lessons from earlier work.
- [`templates/`](templates): the contract request.
- [`roles/`](roles): how each role works.
