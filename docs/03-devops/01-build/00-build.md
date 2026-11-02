---
title: The build
prev: "[[00-devops]]"
next: "[[00-ci-and-release]]"
covers:
  - libs/internal/src/config
  - libs/internal/src/build.ts
  - "**/vite.config.ts"
  - "**/tsup.config.ts"
---

# The build

Every Velnora package is an ES library built from `src/main.ts` into `build/`, with one bundled type file beside the JavaScript. The current generation builds with Vite through shared helpers in [`@velnora/internal`](../../04-libraries/12-libs-internal.md); the older generation still has tsup configs that don't build. This page covers the helpers, the output names, and the commands. The exact contract is [the Vite rules](../../../.claude/rules/vite.md).

## The helpers

A package's `vite.config.ts` is one call:

```ts
import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({ name: "kernel" });
```

`defineNodeConfig` is for a library that runs in Node and `defineWebConfig` for one that runs in the browser. Both call `defineBaseConfig` in `libs/internal/src/config/define-base-config.ts`, which sets up the build:

- It emits ES only, into `build/`, emptied first.
- It bundles the declarations with `vite-plugin-dts` and resolves `tsconfig` paths.
- It keeps every `@velnora/*` import external, so no package bundles another.
- It merges anything else the package passes (plugins, `test`, `resolve`) over those defaults with `defu`.

## Output names

The output's base name comes from `getPkgName`: `name: "kernel"` becomes `velnora.kernel`, so the build writes `build/velnora.kernel.js` and `build/velnora.kernel.d.ts`. The package's `exports` must name exactly those files. A second entry goes in `build.lib.entry`, and each key is prefixed with the package name. `@velnora/cli` passes `{ bin: "src/bin.ts" }` and gets `velnora.cli.bin.js`, which its `bin/velnora.js` imports.

The helpers read entries from nowhere else. `libs/velnora` passes `entries: { "velnora.app": "src/app.ts" }`, which Vite ignores, so `velnora/app`'s export points at a file the build doesn't produce. The same mistake is in every older `tsup.config.ts`.

## Commands

Each package's `build` script is `vite build --configLoader runner`. The runner loader lets the config import `@velnora/internal` straight from its TypeScript source, since `@velnora/internal` is never built. The commands you will use:

```bash
yarn nx run @velnora/kernel:build
yarn build
yarn nx run-many -t build
```

The first builds one package with its dependencies first. `yarn build` builds only `velnora` (and so everything it depends on). `yarn nx run-many -t build` builds all of them. The root `prepare` script runs that last one, so `yarn install` builds the whole workspace too.

## The older builds

Twelve packages still have `"build": "tsup --config tsup.config.ts"`. Their configs call `defineNodeConfig` or `defineWebConfig` with an `entries` option, which returns a Vite config that tsup doesn't understand. Don't add a new tsup config. Move a package to Vite when its build is next touched, as its own change, and check its `exports` against the new output.

How built packages get versioned and published is [CI and release](../02-ci-and-release/00-ci-and-release.md).
