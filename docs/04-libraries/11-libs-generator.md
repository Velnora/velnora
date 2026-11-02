---
title: "@velnora/generator"
prev: "[[10-libs-unit-adapter-h3]]"
next: "[[12-libs-internal]]"
covers:
  - libs/generator
---

# @velnora/generator

`@velnora/generator`, at `libs/generator/`, writes the files `velnora init` creates. It has one function today and no dependencies.

## What it exports

`initWorkspace(cwd)` creates the folder if needed and writes two files, each only if it doesn't exist:

| File                | Content                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `velnora.config.ts` | `export default defineConfig({ /* workspace config */ })`, importing `defineConfig` from `velnora` |
| `package.json`      | `name` from the folder's name, `private: true`, `type: "module"`, `workspaces: []`                 |

It returns `{ configPath, packageJsonPath, status }`, where `status` is `created` if it wrote either file and `exists` if both were already there. It has a spec.

## Good to know

The `workspaces` list starts empty, so a fresh workspace has no projects until one is added, and `velnora dev` then stops with "No projects discovered". The older [server runtime](13-libs-runtime-server.md) imports a `TypeGenerator` from this package that it no longer exports. Its targets are `build`, `lint`, `test` and `typecheck`. This is not the Nx generator that scaffolds a new package in this repository; that one is in [`@velnora/internal`](12-libs-internal.md), next.
