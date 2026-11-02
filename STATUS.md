# Velnora status

Updated 2026-11-02 from the code on `chore/agent-setup/codex-workflow`. [The book](docs/velnora.md) explains each part; this page lists what works, what doesn't, and what fails, so nobody mistakes a known failure for a new one.

## What works

- `velnora dev` finds the workspace, reads `velnora.config.ts`, detects the projects, builds the unit graph (adding the Node runtime and the h3 adapter when none are configured), configures the units, picks the HTTP adapter and detects a runtime for each project. Run it with `yarn nx run @velnora-examples/monorepo:dev`.
- `velnora init` creates a `velnora.config.ts` and a private `package.json`.
- The current generation's packages build with Vite through `@velnora/internal`.
- `yarn nx run @velnora/types:test` passes: 816 tests in 76 files.
- `yarn nx run docs:check` checks the book, and `node --test .claude/hooks/department-access/` tests the access hook.

## What doesn't work yet

- **Nothing is served.** The kernel's listen step is commented out, so `velnora dev` stops after picking runtimes. [The kernel and host](docs/02-platform/02-kernel-and-host/00-kernel-and-host.md) has the detail.
- `@velnora/host` serves static files but nothing uses it.
- `velnora build`, `list`, `graph` and `doctor` are registered with empty actions. The npm package manager and the generator's `run()` are stubs.
- The `velnora/app` export is never built: `libs/velnora` passes an `entries` option the Vite helpers ignore.
- The older, tsup-built generation (twelve packages) isn't imported by the current one and doesn't build: its tsup configs pass the Vite helpers' output. [The server runtime](docs/02-platform/04-server-runtime/00-server-runtime.md) lists the packages.
- In that generation, `@velnora/vite-integration` re-exports a missing `integration-container`, `@velnora/plugin-api` re-exports a missing `Integration` type, `@velnora/core` re-exports a missing `./logger`, `@velnora/mf` has no `src/main.ts`, and `@velnora/runtime-server` imports `TypeGenerator` and `PreviewCommandOptions`, which don't exist.

## Known bugs

- `parseConfig` throws for several config files only when there are three or more; two are silently accepted.
- `@velnora/kernel` imports `@velnora/runtime-node` and `@velnora/adapter-h3` without listing them as dependencies, `@velnora/adapter-h3` imports `@velnora/utils` without listing it, and `@velnora/utils` imports `picocolors` without listing it.
- The root `yarn dev` script names `hello-mfe-shell`, which no longer exists.

## Failing checks

- **Typecheck:** `yarn typecheck` fails in every package. Thirteen point at a missing `tsconfig.build.json`; others fail on the `vite/client` types, the `rollupTypes` option that `vite-plugin-dts` 5 no longer accepts, and five dangling imports in `@velnora/types`.
- **Typecheck writes files:** the current generation's `tsconfig.json` doesn't set `noEmit`, so a typecheck writes `.js` files beside the sources. Delete them after a run; never commit them.
- **Lint:** `yarn lint:all` reports 57 errors in existing code.
- **Tests:** the root `yarn test` misses every nested package (`libs/unit/*`, `libs/helper/*`, `libs/runtime/*`, `libs/integrations/*`, `libs/vite/*`). `@velnora/kernel` and `@velnora/host` have specs but no `test` script, Specs that import another workspace package resolve it through its `build/` output, and no `test` target depends on `build`, so they fail to load on a fresh checkout: ten of `@velnora/utils`' fifteen spec files and both of the kernel's. `isAbsoluteRoot`'s spec for `"/"` also fails on Windows, where the function only accepts a drive root.

## CI and release

- The only workflow, `next-release.yml`, runs on pushes to `master` with Node 20, while every package needs Node 24. It runs no lint, test or typecheck, and nothing runs on pull requests.
- Changesets are in pre mode with the `dev` tag. Publishing is the maintainer's.

## Agents and docs

- The runtime is Claude Code: `CLAUDE.md`, the rules under `.claude/rules/`, and the department-access hook in `.claude/settings.json`.
- [The departments](docs/departments/README.md) are written: five departments, eleven roles, and ten agent files under `.claude/agents/`. The flow isn't automated; the coordinator starts each agent by hand, and no role has run on real work yet.
- Tasks live on [the Velnora project board](https://github.com/orgs/Velnora/projects/4). Read and update access was verified on 2026-10-31, when the board had no items.

## Next

Make `velnora dev` serve the example workspace end to end, the v0.1 milestone in [the products chapter](docs/01-products/00-products.md). Before that, the typecheck and the missing dependencies above are the cheapest fixes that make every later check meaningful.
