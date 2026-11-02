---
title: "@velnora/internal"
prev: "[[11-libs-generator]]"
next: "[[13-libs-runtime-server]]"
covers:
  - libs/internal
---

# @velnora/internal

`@velnora/internal`, at `libs/internal/`, is the workspace's own tooling: the Vite build helpers every package uses, the Nx generator that scaffolds a new package, and the Nx executor that checks the docs. It is never built and never imported at runtime. Its `main` points at `src/main.ts`, so Nx and Vite load it straight from TypeScript.

## What it holds

| Part                                    | Where                                         | Explained in                                               |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `defineNodeConfig`, `defineWebConfig`   | `src/build.ts`, `src/config/`                 | [The build](../03-devops/01-build/00-build.md)             |
| `@velnora/internal:package` generator   | `src/generators/package/`, `generators.json`  | [Generating code](../05-development/02-generating-code.md) |
| `@velnora/internal:docs-check` executor | `src/executors/docs-check/`, `executors.json` | [Code quality](../05-development/03-code-quality.md)       |

The `docs` project's `check` target runs the executor, as `yarn nx run docs:check`.

## Good to know

It depends on `@nx/devkit`, `defu`, `string-width`, `vite`, `vite-plugin-dts` and `vite-tsconfig-paths`. It has no `package.json` scripts, so no targets of its own. `define-base-config.ts` passes `rollupTypes` to `vite-plugin-dts`, an option the installed version no longer has, which breaks `typecheck` in every package that loads it.

That ends the current generation. The older one starts with its centre, [`@velnora/runtime-server`](13-libs-runtime-server.md).
