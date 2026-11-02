---
title: "@velnora/utils"
prev: "[[06-libs-host]]"
next: "[[08-libs-types]]"
covers:
  - libs/utils
---

# @velnora/utils

`@velnora/utils`, at `libs/utils/`, holds the implementations the Kernel and every unit share: workspace discovery, config loading, the unit definers, the dependency graph and the global registry. Contracts live in [`@velnora/types`](08-libs-types.md); this is the code behind them.

## What it exports

| Group      | Exports                                                                      | Explained in                                                                                     |
| ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Workspace  | `detectWorkspace`, `detectProjects`, `parseConfig`                           | [Workspace discovery](../02-platform/01-workspace-discovery/00-workspace-discovery.md)           |
| Project    | `Project`                                                                    | [Workspace discovery](../02-platform/01-workspace-discovery/00-workspace-discovery.md#a-project) |
| Units      | `defineUnit`, `defineRuntime`, `defineAdapter`, `defineIntegration`          | [The unit system](../02-platform/03-units/00-units.md)                                           |
| Graph      | `DepGraph`                                                                   | [The unit system](../02-platform/03-units/00-units.md#the-graph-and-the-registry)                |
| Registry   | `GlobalRegistry`, `CONFIG_REGISTRY`, `UNITS_REGISTRY`, `CONTEXT_REGISTRY`    | [The unit system](../02-platform/03-units/00-units.md#the-graph-and-the-registry)                |
| Exceptions | `BaseException`, `NoAdapterProvidedException`, `NoRuntimeProvidedException`  | [The Kernel and Host](../02-platform/02-kernel-and-host/00-kernel-and-host.md)                   |
| Helpers    | `validateVersionRange`, `VELNORA_CONFIG_FILES`, `LEVEL_LABEL`, `LEVEL_COLOR` | This page                                                                                        |

`validateVersionRange(version, range)` wraps `semver`, and the Node runtime uses it against `engines.node`. `LEVEL_LABEL` and `LEVEL_COLOR` map each `LogLevel` to its label and its `picocolors` colour. Internal helpers such as `parseProjectEntry`, `isAbsoluteRoot` and `isPlainObject` aren't exported.

## Good to know

There is a `Logger` and `createLogger` in `src/logger/` with specs, but `src/main.ts` doesn't export them yet. It depends on `@velnora/types`, `destr`, `find-up`, `glob`, `jiti`, `lodash.merge` and `semver`, and imports `picocolors` without listing it. Its targets are `build`, `lint`, `test` and `typecheck`, and nearly every file has a spec beside it.

The contracts all of this implements are next, [`@velnora/types`](08-libs-types.md).
