---
title: The platform
prev: "[[00-example-workspace]]"
next: "[[00-workspace-discovery]]"
covers:
  - libs/kernel
  - libs/host
  - libs/utils
  - libs/unit
  - libs/runtime
---

# The platform

The platform is the code that runs when a developer types `velnora dev`. This page draws the map: the two generations of runtime code in the repository, and the path one `velnora dev` run takes through the current one. The pages after it go through the platform's systems one at a time.

## Two generations

The repository holds two attempts at the runtime, and only one of them runs.

The current generation is what `velnora dev` uses. It starts in [`@velnora/cli`](../04-libraries/02-libs-cli.md), which creates a [Kernel](../04-libraries/05-libs-kernel.md). The Kernel finds the workspace through [`@velnora/utils`](../04-libraries/07-libs-utils.md) and loads units (runtimes, adapters and integrations) typed by [`@velnora/types`](../04-libraries/08-libs-types.md). Its two built-in units are [the Node runtime](../04-libraries/09-libs-unit-runtime-node.md) and [the h3 adapter](../04-libraries/10-libs-unit-adapter-h3.md). These packages all build with Vite through `@velnora/internal`.

The older generation is a full Vite dev server with file-based routing, server-side rendering, and React and Nest integrations. Its centre is [`@velnora/runtime-server`](../04-libraries/13-libs-runtime-server.md). Nothing in the current generation imports any of it, and its packages still build with tsup and point their typecheck at a `tsconfig.build.json` that doesn't exist. It is kept because it holds working ideas the current generation will need, such as SSR, routing and framework detection. [The server runtime](04-server-runtime/00-server-runtime.md) describes it.

## One `velnora dev` run

1. The CLI parses the command line and calls `createKernel()`, then `kernel.init()`, then `kernel.boot(options)`.
2. `init()` finds the workspace root, the nearest `package.json` above the working directory that declares `workspaces`, and moves the process into it ([workspace discovery](01-workspace-discovery/00-workspace-discovery.md)).
3. It loads the root `velnora.config.*` and discovers every project in the workspace globs, each with its own config ([configuration](01-workspace-discovery/01-configuration.md)).
4. It puts the configured integrations into a unit graph, and adds the Node runtime and the h3 adapter if no unit of that kind was configured ([the unit system](03-units/00-units.md)).
5. `boot()` calls `configure()` on every unit, so each one can expose its API, then picks the single HTTP adapter and records its `http` API.
6. For every project it asks each runtime's `detect()` whether it can run that project, and logs the first one that can. If none can, it throws.
7. It stops there. The code that would start listening is commented out, so no server opens. [The Kernel and Host](02-kernel-and-host/00-kernel-and-host.md) covers steps 5 to 7 and what is missing.

## Its systems

[Workspace discovery](01-workspace-discovery/00-workspace-discovery.md) finds the workspace and its projects and loads their configuration. [The Kernel and Host](02-kernel-and-host/00-kernel-and-host.md) runs the lifecycle above and covers the h3 Host it used to start. [The unit system](03-units/00-units.md) is how runtimes, adapters and integrations plug in and find each other. [The server runtime](04-server-runtime/00-server-runtime.md) is the older Vite stack.

The first system, [workspace discovery](01-workspace-discovery/00-workspace-discovery.md), is where every run begins.
