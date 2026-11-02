---
title: "@velnora/vite-integration"
prev: "[[13-libs-runtime-server]]"
next: "[[15-libs-devkit]]"
covers:
  - libs/vite/integration
---

# @velnora/vite-integration

`@velnora/vite-integration`, at `libs/vite/integration/`, wraps Vite for the older server runtime. It builds one Vite config for the whole workspace, runs Vite as middleware inside the server's HTTP app, and serves virtual modules that integrations register.

## What it holds

`ViteContainer` collects the Vite config. It sets the workspace root, middleware mode, `appType: "custom"`, source maps, and `import.meta.env.CLIENT` and `SERVER`. It also merges in each integration's plugins, and keeps a map of virtual module ids to their code. `ViteServer` creates the Vite dev server on top of the container, and `ViteDev` is its running form. Its plugins:

- `virtual-module` serves the container's virtual modules.
- `html` writes a default HTML shell for an app with none.
- `dev-source-map` keeps source maps readable in development.

`src/utils/` finds the right `tsconfig` for an app.

## Good to know

`src/core/index.ts` re-exports an `integration-container` file that isn't there, though `runtime-server` imports `IntegrationContainer` from this package. It depends on both `vite` and `rolldown-vite`. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The graph, contexts and injector the server uses are next, [`@velnora/devkit`](15-libs-devkit.md).
