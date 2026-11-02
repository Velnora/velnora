---
title: "@velnora/runtime-node"
prev: "[[08-libs-types]]"
next: "[[10-libs-unit-adapter-h3]]"
covers:
  - libs/unit/runtime/node
---

# @velnora/runtime-node

`@velnora/runtime-node`, at `libs/unit/runtime/node/`, is the runtime unit for Node projects. Its default export, made with `defineRuntime`, is the runtime the Kernel adds when the config names none. [The unit system](../02-platform/03-units/00-units.md#the-units-velnora-ships) shows where it fits.

## What it does

| Member                       | Behaviour                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `name`, `runtime`            | `node`                                                                                          |
| `capabilities`               | `javascript`, `node`                                                                            |
| `detect(cwd)`                | True when `cwd` has a `package.json` whose `engines.node` is absent or matches the running Node |
| `resolve(ctx)`               | Runs `node` to read its `execPath` and version, and returns `engines.node` or that version      |
| `configure(ctx)`             | Exposes a `JavaScriptRuntime` as `node` and `javascript`                                        |
| `resolvePackageManager(cwd)` | An `NpmPackageManager` when `package-lock.json` exists, otherwise nothing                       |

## Good to know

The exposed runtime's `run(file)` is empty, and `NpmPackageManager`'s methods return `undefined` where they promise a dependency tree, which `typecheck` reports. There is no Yarn or pnpm package manager yet. The compile, execute, test and package hooks are commented out. It depends on `@velnora/utils`, and its targets are `build`, `lint`, `test` and `typecheck`.

The other default unit is the HTTP adapter, [`@velnora/adapter-h3`](10-libs-unit-adapter-h3.md).
