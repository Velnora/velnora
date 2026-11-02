---
title: "@velnora/integrations-react"
prev: "[[19-libs-core]]"
next: "[[21-libs-integrations-nest]]"
covers:
  - libs/integrations/react
---

# @velnora/integrations-react

`@velnora/integrations-react`, at `libs/integrations/react/`, is the older generation's React integration, the most complete piece of it. It detects a React app, picks client-side or server-side rendering, and registers the app's routes and Vite environments. It has three entries: the integration at the package root, the browser side at `/client`, and the server-side renderers at `/server`.

## How it decides

`react()` applies to an app that has `client/app.{js,ts,jsx,tsx}` or `client/app/**/page.*`, and that can use React and React DOM 18 or 19. The mode comes from `react.mode` in the app's config, or from the files:

| Mode  | Chosen when                                | What it sets up                                                                   |
| ----- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| `csr` | A single `client/app.*` file               | A client Vite environment and a frontend route that mounts the app in the browser |
| `ssr` | A `client/app/` folder with `page.*` files | Server rendering per page, with layouts, metadata and hydration in the browser    |
| `rsc` | Only when configured                       | Nothing; `setupRsc` is empty                                                      |

It adds `@vitejs/plugin-react` with the automatic JSX runtime. The browser side has a `RouterProvider`, `useRouter`, layouts and pages, and `hydrateSsrApp`. The server side renders either a single-file app or an `app/` folder, and treats special file names such as layouts as their roles.

## Good to know

`scaffold` is commented out. It depends on `@velnora/devkit`, `@velnora/plugin-api`, `@velnora/router` and `@vitejs/plugin-react`, with `react` and `react-dom` as peers. It builds with tsup and its `typecheck` points at a missing `tsconfig.build.json`.

The server-side counterpart is [`@velnora/integrations-nest`](21-libs-integrations-nest.md), next.
