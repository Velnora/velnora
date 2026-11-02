# Ecosystem rules

Rules for every Ecosystem role, on top of [the handbook](../RULES.md), whose "Writing code" section binds both roles. What Ecosystem does is in [`README.md`](README.md).

## Contracts, not internals

- Use only what an engine package exports. Never import from another package's `src/` path or depend on behaviour its exports don't promise.
- When the work needs a capability the engine doesn't offer, stop and return a [contract request](templates/contract-request.md) with the use case and a proposed shape. Core platform decides the shape, and the task waits for it or the coordinator adds it to the route.

## Evidence

- A change to an integration, an adapter, a CLI command or the generator is shown working on a real project: the example workspace, or a temporary one the plan describes. Record the exact commands and what they printed in your report.
- Run the example workspace with `yarn nx run @velnora-examples/monorepo:dev`, never the root `yarn dev`.

## Users first

- A command, an option, a generated file or an integration's config shape is something users rely on. Changing one is a contract change: the plan names it, and it gets a changeset.
