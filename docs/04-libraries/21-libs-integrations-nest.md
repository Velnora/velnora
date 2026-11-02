---
title: "@velnora/integrations-nest"
prev: "[[20-libs-integrations-react]]"
next: "[[22-libs-integrations-microfrontend]]"
covers:
  - libs/integrations/nest
---

# @velnora/integrations-nest

`@velnora/integrations-nest`, at `libs/integrations/nest/`, is the older generation's integration for a NestJS server inside an app. It finds the app's root Nest module and mounts it as that app's backend.

## How it works

`nest()` applies to an app with `server/app.module.{js,ts}` or `server/<app name>.module.{js,ts}`, and that can use `@nestjs/common` and `@nestjs/core` 11. `configure` finds that one module file, logging an error and skipping if there are none or several. It then does three things:

1. It generates a virtual `nest/app-module` that re-exports the module as `<AppName>Module` or `AppModule`.
2. It builds a server entry that calls `setupServer(AppModule)` and adds an SSR Vite environment for it, with `__NESTJS_PLATFORM_SERVER__` defined.
3. It registers it with the router as the app's backend.

`src/server.ts` is the `setupServer` side, which starts Nest on `@nestjs/platform-express`.

## Good to know

`scaffold` and `build` are commented out, and its "could not find entry file" message still says React. It depends on `@nestjs/platform-express`, `@velnora/devkit`, `@velnora/plugin-api` and `@velnora/types`, with `@nestjs/common`, `@nestjs/core` and `rxjs` as peers. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The micro-frontend integration that was meant to join apps together is next, [`@velnora/mf`](22-libs-integrations-microfrontend.md).
