---
title: Configuration
prev: "[[00-workspace-discovery]]"
next: "[[00-kernel-and-host]]"
covers:
  - libs/utils/src/workspace/parse-config.ts
  - libs/types/src/config
  - libs/velnora/src
---

# Configuration

Velnora has two levels of configuration, like `tsconfig.json` with a base file and per-project files. The workspace has one `VelnoraConfig` at its root, and each project may have a `VelnoraAppConfig` next to its `package.json`. Both are optional; a missing file means `{}`. This page covers how a file is found and loaded and what each level holds today.

## Finding and loading a file

`parseConfig(dir)` in [`@velnora/utils`](../../04-libraries/07-libs-utils.md) looks in one folder for `velnora.config.ts`, `velnora.config.js` and `velnora.config.json`, the list in `VELNORA_CONFIG_FILES`. It loads whichever it finds:

- A JSON file is parsed with `destr`.
- A TypeScript or JavaScript file is imported through `jiti`, and its default export is the config.
- A file that fails to load logs the error and counts as `{}`, so a broken config never stops discovery.

The workspace file is loaded during `init()`. Each project's file is loaded as the project is discovered.

The guard against several config files in one folder has an off-by-one: it throws only when three exist. With two, the first match wins silently.

## The workspace config

| Field           | Type                                             | Read by                                                                                    |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `integrations`  | Units, or functions of `ConfigEnv` returning one | The Kernel, which loads them into the unit graph. It defaults to `[]`                      |
| `resolve.units` | `Record<string, string>`                         | `BaseContext`, to redirect one unit API name to another ([units](../03-units/00-units.md)) |

A unit given as a function is called with `{ command: "serve", mode: "development" }`, which the Kernel hard-codes for now. That is the same `ConfigEnv` idea as Vite's `defineConfig(({ command, mode }) => …)`.

## The project config

| Field          | Type                                    | Read by                                    |
| -------------- | --------------------------------------- | ------------------------------------------ |
| `runtime`      | `string`                                | Nothing yet                                |
| `environments` | `Record<"dev" \| "prod" \| string, {}>` | Nothing yet; `VelnoraEnvironment` is empty |

`runtime` is meant to name the runtime a project uses when several could run it. Today the Kernel always takes the first runtime whose `detect()` accepts the project.

## Typing a config

`defineConfig` from `velnora` types the workspace file and `defineConfig` from `velnora/app` types a project file. Both return their argument unchanged. Runtime validation is not wired. The Zod schemas in [`@velnora/contracts`](../../04-libraries/18-libs-contracts.md) describe the older generation's much larger config (`apps`, `server`, `experiments`, `cacheDir`). `@velnora/types` still carries those older shapes under `src/config/velnora/` and `src/config/velnora-app/`, but doesn't export them, and they import files that no longer exist.

With the workspace, its projects and their config in hand, [the Kernel and Host](../02-kernel-and-host/00-kernel-and-host.md) takes over.
