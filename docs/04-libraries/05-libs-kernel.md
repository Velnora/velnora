---
title: "@velnora/kernel"
prev: "[[04-packages-cli]]"
next: "[[06-libs-host]]"
covers:
  - libs/kernel
---

# @velnora/kernel

`@velnora/kernel`, at `libs/kernel/`, runs a `velnora dev` run: it finds the workspace, loads the units, and picks the adapter and a runtime per project. [The Kernel and Host](../02-platform/02-kernel-and-host/00-kernel-and-host.md) covers the lifecycle; this page is the package.

## What it exports

| Export         | What it is                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `createKernel` | Returns a new `Kernel`                                                                             |
| `Kernel`       | `init()`, `boot(options?)`, `shutdown()`, and the getters `workspaceRoot` and `discoveredProjects` |

`BaseContext`, in `src/helper/base-context.ts`, is the context every unit gets; it isn't exported. [The unit system](../02-platform/03-units/00-units.md) explains `expose` and `query`.

## Good to know

Its `package.json` lists `@velnora/commands`, `@velnora/host`, `@velnora/utils`, `lodash.merge` and `type-fest`. It imports `@velnora/runtime-node` and `@velnora/adapter-h3` without listing them, and lists `@velnora/host` without importing it. Its targets are `build`, `lint` and `typecheck`. It has specs for `Kernel` and `createKernel` but no `test` script, so `nx test` skips it; they run only from the root `yarn test`.

The h3 server the Kernel used to start is next, [`@velnora/host`](06-libs-host.md).
