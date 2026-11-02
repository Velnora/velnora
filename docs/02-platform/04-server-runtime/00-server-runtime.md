---
title: The server runtime
prev: "[[00-units]]"
next: "[[00-devops]]"
covers:
  - libs/runtime
  - libs/vite/integration
  - libs/devkit
  - libs/router
  - libs/plugin-api
  - libs/contracts
  - libs/core
  - libs/integrations
  - libs/rpc
---

# The server runtime

Before the Kernel and the unit system, Velnora had a different runtime built on Vite: a dev server that indexed every app, ran framework integrations over it, routed requests by file, and rendered React on the server. It is still in the repository as twelve packages. None of them is imported by the current generation, and none of them typechecks today. This page describes what it was built to do, so its ideas can be carried into units deliberately rather than rediscovered. What it can't do: run at all against the current packages.

## How it was meant to run

[`@velnora/runtime-server`](../../04-libraries/13-libs-runtime-server.md) exports `createDevServer(options)`, which assembles the whole server in one pass:

1. It loads and merges the config, the large Zod-validated shape in [`@velnora/contracts`](../../04-libraries/18-libs-contracts.md), and stores it as a global.
2. It builds a module graph of the workspace's apps (from [`@velnora/devkit`](../../04-libraries/15-libs-devkit.md)) and indexes them.
3. It creates a logger from [`@velnora/core`](../../04-libraries/19-libs-core.md) and a [router](../../04-libraries/16-libs-router.md).
4. It creates a Vite container from [`@velnora/vite-integration`](../../04-libraries/14-libs-vite-integration.md). Vite runs in middleware mode with `import.meta.env.CLIENT` and `SERVER` defined.
5. It creates a type generator, a context manager, and an integration container that configures every integration against every app.
6. It creates an Express-based HTTP server and a Vite dev server on top of it, then an injector that wires routes and server handlers in.
7. It returns a `Velnora` object with `listen()`, `printUrls()` and `close()`, which logs "Velnora Dev Server ready".

`createPreviewServer` is an empty function.

## Integrations in that generation

An integration there was a plain object made by `defineIntegration` from [`@velnora/plugin-api`](../../04-libraries/17-libs-plugin-api.md), separate from the unit system's `defineIntegration`. It had three hooks. `apply(ctx)` decided from the app's files and packages whether the integration applies. `configure(ctx)` registered client and server entries, routes and Vite plugins. `scaffold(ctx)` was meant to generate starter files and is commented out.

[`@velnora/integrations-react`](../../04-libraries/20-libs-integrations-react.md) applies to an app with `client/app.*` or `client/app/**/page.*` and React 18 or 19. It picks client-side rendering for a single `app` file and server-side rendering for an `app/` folder of pages, unless `react.mode` in the app config says otherwise. It brings `@vitejs/plugin-react`, a client router, layouts and hydration; its `rsc` mode is an empty function. [`@velnora/integrations-nest`](../../04-libraries/21-libs-integrations-nest.md) applies to an app with `server/app.module.*` or `server/<name>.module.*` and Nest 11, and mounts it as the app's server. [`@velnora/mf`](../../04-libraries/22-libs-integrations-microfrontend.md), meant for micro-frontends, has only a debug logger and no entry file. [`@velnora/rpc`](../../04-libraries/23-libs-rpc.md) and [`@velnora/runtime-client`](../../04-libraries/24-libs-runtime-client.md) export nothing.

## Why it doesn't run

The packages point `typecheck` at a `tsconfig.build.json` that none of them has, so they are never checked. Their `tsup.config.ts` files import Vite helpers from `@velnora/internal`, which return a Vite config rather than a tsup one. And they import things that moved: `runtime-server` imports `TypeGenerator` from `@velnora/generator`, which now exports only `initWorkspace`, and `@velnora/core`'s entry re-exports a `./logger` folder that is gone. [`STATUS.md`](../../../STATUS.md) lists the failures.

Each idea here should come across as a unit when it is needed, and the package it lived in can then be deleted. Some carry over directly: Vite as the dev server, file-based routes, `apply` detection for React and Nest, and SSR. That choice belongs to an issue each, not to a sweep.

That ends the platform. [DevOps](../../03-devops/00-devops.md) covers how all these packages are built and released.
