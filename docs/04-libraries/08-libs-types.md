---
title: "@velnora/types"
prev: "[[07-libs-utils]]"
next: "[[09-libs-unit-runtime-node]]"
covers:
  - libs/types
---

# @velnora/types

`@velnora/types`, at `libs/types/`, holds the shared contracts: interfaces and types only, with one enum, `UnitKind`, and no runtime code beyond it. Every other package depends on it, and it depends on nothing at runtime.

## What it exports

| Folder            | Holds                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `config`          | `VelnoraConfig`, `VelnoraAppConfig`, `VelnoraEnvironment`                                              |
| `unit`            | `UnitKind`, `Unit`, `VelnoraUnit`, the runtime, adapter and integration unit types, and their contexts |
| `project`         | `Project` and `ProjectOptions`                                                                         |
| `http`            | `BaseHttpAdapter` and `HttpHandler`                                                                    |
| `logger`          | `LogLevel` and the logger types                                                                        |
| `package-manager` | The package manager contract runtimes implement                                                        |
| `utils`           | `ConfigEnv`, `RequiredKeys` and other helper types                                                     |

`src/velnora-env.d.ts` declares the global `Velnora` namespace, including the empty `Velnora.UnitRegistry` that unit packages extend ([the unit system](../02-platform/03-units/00-units.md#typed-apis-through-velnoraunitregistry)).

## Good to know

Several folders are left over from the older generation and aren't exported from `src/main.ts`: `backend`, `generator`, `module-graph`, `router`, `types`, `vite`, and the nested `config/velnora/` and `config/velnora-app/` shapes. Five of their files import modules that no longer exist (`../package`, `../../integration`, `../context`, `../integration`), which is part of why `typecheck` fails. Many types have `expectTypeOf` specs beside them. Its targets are `build`, `lint`, `test` and `typecheck`.

The first package built on these contracts is the default runtime, [`@velnora/runtime-node`](09-libs-unit-runtime-node.md).
