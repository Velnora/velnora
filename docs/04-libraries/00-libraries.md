---
title: The libraries
prev: "[[00-ci-and-release]]"
next: "[[01-libs-velnora]]"
covers:
  - libs
  - packages
---

# The libraries

Velnora is 24 packages in one workspace, plus the build-only `@velnora/internal`. This chapter has one page per package. Each page says what the package exports, which targets it has, and what state it is in; the mechanisms are in [the platform](../02-platform/00-platform.md) and the build in [DevOps](../03-devops/00-devops.md). The pages run in reading order: the packages `velnora dev` runs on first, then the build tooling, then the older generation.

## Package roles

| Package                       | Folder                            | Role                                                          | Builds with |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------- | ----------- |
| `velnora`                     | `libs/velnora`                    | The public package: `defineConfig` and the `velnora` binary   | Vite        |
| `@velnora/cli`                | `libs/cli`                        | Gives each command its action                                 | Vite        |
| `@velnora/commands`           | `libs/helper/commands`            | Declares the commands and their option types                  | Vite        |
| `@velnora/cli-helper`         | `packages/cli`                    | A typed command builder over yargs                            | Vite        |
| `@velnora/kernel`             | `libs/kernel`                     | The lifecycle: init, boot, shutdown                           | Vite        |
| `@velnora/host`               | `libs/host`                       | The old h3 static host, unused                                | Vite        |
| `@velnora/utils`              | `libs/utils`                      | Discovery, config loading, units, graph, registry             | Vite        |
| `@velnora/types`              | `libs/types`                      | Shared contracts                                              | Vite        |
| `@velnora/runtime-node`       | `libs/unit/runtime/node`          | The default Node runtime unit                                 | Vite        |
| `@velnora/adapter-h3`         | `libs/unit/adapter/h3`            | The default h3 HTTP adapter unit                              | Vite        |
| `@velnora/generator`          | `libs/generator`                  | `initWorkspace` for `velnora init`                            | Vite        |
| `@velnora/internal`           | `libs/internal`                   | Build helpers, the package generator, docs-check; never built | None        |
| `@velnora/runtime-server`     | `libs/runtime/server`             | The older Vite dev server                                     | tsup        |
| `@velnora/vite-integration`   | `libs/vite/integration`           | Vite container, dev server and plugins for it                 | tsup        |
| `@velnora/devkit`             | `libs/devkit`                     | Module graph, context manager, injector                       | tsup        |
| `@velnora/router`             | `libs/router`                     | File-based routes, client and server routers                  | tsup        |
| `@velnora/plugin-api`         | `libs/plugin-api`                 | The older `defineIntegration`                                 | tsup        |
| `@velnora/contracts`          | `libs/contracts`                  | Zod schemas for the older config                              | tsup        |
| `@velnora/core`               | `libs/core`                       | Logger and merge helpers                                      | tsup        |
| `@velnora/integrations-react` | `libs/integrations/react`         | React CSR and SSR                                             | tsup        |
| `@velnora/integrations-nest`  | `libs/integrations/nest`          | Nest server apps                                              | tsup        |
| `@velnora/mf`                 | `libs/integrations/microfrontend` | Micro-frontends, empty                                        | tsup        |
| `@velnora/rpc`                | `libs/rpc`                        | Empty                                                         | tsup        |
| `@velnora/runtime-client`     | `libs/runtime/client`             | Empty                                                         | tsup        |

## How they depend on each other

Dependencies in the current generation point one way:

```text
velnora → @velnora/cli → @velnora/kernel → @velnora/utils → @velnora/types
                       → @velnora/commands → @velnora/cli-helper
                       → @velnora/generator
          @velnora/kernel → @velnora/runtime-node, @velnora/adapter-h3 → @velnora/utils
```

`@velnora/types` sits at the bottom and everything uses it. `@velnora/internal` is a dev-time dependency only, never imported at runtime. The Kernel imports the Node runtime and the h3 adapter as defaults but doesn't list them in its `package.json`. The h3 adapter likewise imports `@velnora/utils` without listing it. Both only work because the packages live in the same workspace.

Every package's public boundary is its `src/main.ts`, built into the files its `exports` name; import a package by its name, never by a path into its `src/`. Most source files carry a `@velnora-meta` header with `type`, `project`, `author`, `package`, `layer` (`core` or `tooling`) and `visibility` (`public` or `internal`). Nothing reads it yet.

The first package is the one a developer installs, [`velnora`](01-libs-velnora.md).
