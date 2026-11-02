# Ecosystem knowledge

Facts and lessons for the integrations and tooling roles. Not rules: the rules are in [`RULES.md`](RULES.md) and [`.claude/rules/`](../../../.claude/rules).

## Facts

- The current generation's only adapter is `@velnora/adapter-h3`, and its only runtime is `@velnora/runtime-node`. The kernel adds both when a workspace configures no units.
- The React, Nest and micro-frontend integrations and `@velnora/vite-integration` belong to the older, tsup-built generation and don't build or typecheck today. [The server runtime](../../02-platform/04-server-runtime/00-server-runtime.md) page explains that generation.
- `velnora init` comes from `@velnora/generator`. `build`, `list`, `graph` and `doctor` are registered commands with empty bodies.
- The example workspace at `examples/monorepo` holds two static projects and no `velnora.config.ts`. [The example workspace](../../01-products/02-example-workspace/00-example-workspace.md) page has the detail.
- The root `yarn dev` script names a project that no longer exists.

## Lessons

None yet.
