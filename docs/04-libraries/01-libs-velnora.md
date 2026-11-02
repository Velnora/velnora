---
title: velnora
prev: "[[00-libraries]]"
next: "[[02-libs-cli]]"
covers:
  - libs/velnora
---

# velnora

`velnora`, at `libs/velnora/`, is the package a developer installs. It gives them `defineConfig` for their config files and the `velnora` command, and depends only on `@velnora/cli`.

## What it exports

| Export        | From             | What it is                                                                   |
| ------------- | ---------------- | ---------------------------------------------------------------------------- |
| `velnora`     | `src/main.ts`    | `defineConfig(config: VelnoraConfig)`, for the workspace `velnora.config.ts` |
| `velnora/app` | `src/app.ts`     | `defineConfig(config: VelnoraAppConfig)`, for a project's config file        |
| `velnora` bin | `bin/velnora.js` | Resolves `@velnora/cli` and runs its `bin/velnora.js`                        |

Both `defineConfig`s return their argument unchanged; they exist for type checking. [Configuration](../02-platform/01-workspace-discovery/01-configuration.md) covers what goes in each file.

## Good to know

The `velnora/app` export names `build/velnora.app.js`, but `vite.config.ts` passes it as `entries`, which the build helpers ignore, so the file is never built. The fix is to pass it as `build.lib.entry`, as [the build](../03-devops/01-build/00-build.md) explains. The package also has `meta/` (`core`, `react`, `router`) and a `client.d.ts` that re-export older-generation packages. They aren't in `exports`, so nothing can import them through the package name.

Its targets are `build`, `lint`, `test` and `typecheck`, and `yarn build` at the root builds this package. The command it runs comes from [`@velnora/cli`](02-libs-cli.md).
