---
title: The example workspace
prev: "[[01-project-foundation]]"
next: "[[00-platform]]"
covers:
  - examples/monorepo
---

# The example workspace

`examples/monorepo` is a small Yarn workspace checked into the repository, so a developer can run `velnora dev` against something real without creating a workspace first. It is the fixture every change to discovery or the dev command should be tried against, and it is the only example today.

## What is in it

The workspace's `package.json` is `@velnora-examples/monorepo`. It is private, declares `packages/*` and `libs/*` as its workspaces, has a single `dev` script that runs `velnora dev`, and installs `velnora` from this repository with `workspace:^`. It has no `velnora.config.ts`, so every project runs on defaults.

| Project            | Folder             | Content                                              |
| ------------------ | ------------------ | ---------------------------------------------------- |
| `@example/app-one` | `packages/app-one` | `src/index.html`, `src/index.js` and `src/style.css` |
| `@example/lib-one` | `libs/lib-one`     | `src/index.html` only                                |

Both projects are plain static pages with no framework. That matches the v0.1 goal on [the product page](../00-products.md): serve each project's files under its own path. The old [Host](../../04-libraries/06-libs-host.md) did exactly that, at `/@example/app-one/` and `/@example/lib-one/`.

## Running it

From the repository root, after `yarn install`:

```bash
yarn nx run @velnora-examples/monorepo:dev
```

Nx runs the workspace's `dev` script, which starts `velnora dev` inside `examples/monorepo`. The Kernel walks up from there to the nearest `package.json` with `workspaces`, which is the example's own. It discovers both projects, configures the default Node runtime and h3 adapter, and logs the runtime it picked for each project. Nothing is served yet, as [the Kernel and Host](../../02-platform/02-kernel-and-host/00-kernel-and-host.md) explains.

The root `package.json` still has a `dev` script that runs `nx run hello-mfe-shell:dev`. That project no longer exists, so use the command above instead. [`STATUS.md`](../../../STATUS.md) tracks the fix.

That ends the product chapter. [The platform](../../02-platform/00-platform.md) opens the code behind it, starting with what `velnora dev` does step by step.
