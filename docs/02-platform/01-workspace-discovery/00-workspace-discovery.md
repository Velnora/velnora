---
title: Workspace discovery
prev: "[[00-platform]]"
next: "[[01-configuration]]"
covers:
  - libs/utils/src/workspace
  - libs/utils/src/project
---

# Workspace discovery

Workspace discovery answers two questions before anything else runs: where the workspace root is, and which projects are in it. It lives in [`@velnora/utils`](../../04-libraries/07-libs-utils.md) as `detectWorkspace` and `detectProjects`, and the Kernel calls both at the start of `init()`. It is the most finished part of the runtime, with a spec file beside every function. What it can't do yet: it knows Yarn and npm `workspaces` only, not `pnpm-workspace.yaml` or Nx project graphs, and it does not read nested workspaces.

## Finding the root

`detectWorkspace(cwd)` walks up from the working directory, one `package.json` at a time, and stops at the first one that has a `workspaces` field. That file's folder is the root. A `package.json` that can't be read or parsed is skipped, not fatal. If the walk reaches the filesystem root without a match, it throws "No workspace root found". The Kernel then calls `process.chdir(root)`, so every later path is relative to the root. Running `velnora dev` from anywhere inside a workspace therefore behaves the same as running it at the top.

## Finding the projects

`detectProjects(rootPackageJson)` turns each workspace pattern into a glob for `<pattern>/package.json`. Both the array form and the `{ packages: [...] }` form are read. Matches are filtered by the root `.gitignore`, plus `node_modules`, `dist`, `build` and `.git` when `.gitignore` doesn't already mention them.

Each match becomes a `Project` through `parseProjectEntry`. A `package.json` without a `name` is skipped with a warning, and a project that fails to load is skipped with the error logged. Two globs matching the same folder produce one project.

## A project

A `Project` is a class in `@velnora/utils` that implements the `Project` interface from `@velnora/types`. Consumers type against the interface; the class is how the getters are derived.

| Getter        | Comes from                                | Example for the example workspace      |
| ------------- | ----------------------------------------- | -------------------------------------- |
| `name`        | Folder path relative to the root          | `packages/app-one`                     |
| `displayName` | `packageJson.name`                        | `@example/app-one`                     |
| `path`        | `/` + `packageJson.name`, the URL prefix  | `/@example/app-one`                    |
| `root`        | Absolute folder path                      | `…/examples/monorepo/packages/app-one` |
| `packageJson` | The parsed `package.json`                 | `{ name: "@example/app-one", … }`      |
| `config`      | The project's `velnora.config.*`, or `{}` | `{}`                                   |

Projects started as plain object literals, with `displayName` and `path` typed in by hand at every creation site. The class made both derived values, so a project's URL can never disagree with its package name.

How each project's config, and the workspace's, are found and loaded is the next page, [configuration](01-configuration.md).
