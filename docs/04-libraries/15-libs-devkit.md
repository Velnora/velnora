---
title: "@velnora/devkit"
prev: "[[14-libs-vite-integration]]"
next: "[[16-libs-router]]"
covers:
  - libs/devkit
---

# @velnora/devkit

`@velnora/devkit`, at `libs/devkit/`, is the older generation's toolkit for integration authors and for the server runtime. It has two entries, a Node one at `@velnora/devkit` and a browser one at `@velnora/devkit/client`.

## What it holds

The Node side has these pieces:

- `ModuleGraph` indexes the workspace's apps.
- `ContextManager` builds the context each integration's `apply` and `configure` receive, with its file helpers (`fs.exists`, `fs.glob`, `pushd`, `popd`), package checks and logger.
- `Injector` takes the routes and server handlers integrations registered and wires them into the HTTP server and Vite.
- `globals` is the global store `runtime-server` keeps the config in.

It also has an HTML pipeline (parse, inject tags, stream out) for server rendering, `loadConfigFile`, and `getModuleString`, which the Nest integration uses to generate entry code.

The client side gives the browser `getModule(module, names)`, which returns the first of several export names a loaded module has, so an entry can be found under `default`, `App` or another name.

## Good to know

Its `package.json` names entries at `build/velnora.devkit.js` and `build/velnora.devkit.client.js`, but there is no `src/main.ts`, only `src/node/main.ts` and `src/client/main.ts`. It depends on `@velnora/contracts` and `@velnora/vite-integration`, plus `glob`, `htmlparser2`, `lodash`, `uuid`, `yaml` and `zod`. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The routes the injector wires come from [`@velnora/router`](16-libs-router.md), next.
