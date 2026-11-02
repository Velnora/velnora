---
title: "@velnora/runtime-server"
prev: "[[12-libs-internal]]"
next: "[[14-libs-vite-integration]]"
covers:
  - libs/runtime/server
---

# @velnora/runtime-server

`@velnora/runtime-server`, at `libs/runtime/server/`, is the centre of the older generation. It assembles the Vite-based dev server from every other older package. [The server runtime](../02-platform/04-server-runtime/00-server-runtime.md) walks through what `createDevServer` builds; this page is the package.

## What it exports

| Export                | What it is                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `createDevServer`     | Builds the config, module graph, router, Vite container, integrations, HTTP server and injector, and returns a `Velnora` |
| `createPreviewServer` | Empty                                                                                                                    |

The `Velnora` it returns has `listen()`, `printUrls()`, `close()`, `http` and `middlewares`. Its `Http` is an Express app on a Node HTTP server. Neither class is exported. `loadAndMergeConfig` reads the config file through `@velnora/devkit`'s `loadConfigFile`, merges the command's options in, and parses the result with `velnoraConfigSchema` from [`@velnora/contracts`](18-libs-contracts.md).

## Good to know

It imports `TypeGenerator` from `@velnora/generator`, which no longer exports one, and `DevCommandOptions` and `PreviewCommandOptions` from `@velnora/commands`, which declares only the first. It depends on `@velnora/commands`, `contracts`, `core`, `devkit`, `router` and `vite-integration`, plus `debug`, `express`, `hookable` and `lodash`. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The Vite layer it builds on is next, [`@velnora/vite-integration`](14-libs-vite-integration.md).
