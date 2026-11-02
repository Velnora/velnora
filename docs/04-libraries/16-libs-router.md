---
title: "@velnora/router"
prev: "[[15-libs-devkit]]"
next: "[[17-libs-plugin-api]]"
covers:
  - libs/router
---

# @velnora/router

`@velnora/router`, at `libs/router/`, is the older generation's router, with three entries: the shared router at `@velnora/router`, a browser router at `@velnora/router/client`, and a server router at `@velnora/router/server`.

## What it holds

The shared `Router` keeps every registered route. `withApp(app)` returns a `Routing` scoped to one app, for an integration to register that app's routes. `getRoutes()` sorts the routes so the most specific path comes first (more segments, then longer). `getById` finds a route by id. `fileToRoutePath` turns a page file's path into its URL path, and `collectLayoutsForPage` finds the layout files that wrap a page, which is how the React integration's `app/` folder becomes nested routes.

The client side keeps one `GlobalRouter` on `globalThis` for the page, with a router per app. It listens to `popstate` and tells the app whose path changed. The server side builds the router the server runtime registers routes on.

## Good to know

There is no `src/main.ts`; the three entries live in `src/router/`, `src/client/` and `src/server/`. It depends only on `@velnora/types`. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

Integrations register those routes through [`@velnora/plugin-api`](17-libs-plugin-api.md), next.
