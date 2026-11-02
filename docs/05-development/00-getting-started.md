---
title: Getting started
prev: "[[24-libs-runtime-client]]"
next: "[[01-testing]]"
covers:
  - package.json
  - .yarnrc.yml
  - .editorconfig
---

# Getting started

This chapter takes you from a fresh clone to running Velnora, testing it, generating a package and keeping the code clean. This page covers the setup and the first run. There are no services, databases or environment files to set up; everything is Node and Yarn.

## What you need

Node 24 or newer: the root `package.json` accepts Node 22, but every package requires 24. Yarn comes with the repository, version 4.12.0, pinned in `packageManager` and checked in under `.yarn/`, so run `corepack enable` once and use `yarn` everywhere.

## First run

```bash
yarn install
yarn nx run @velnora-examples/monorepo:dev
```

`yarn install` also runs the root `prepare` script, which builds every package with `nx run-many -t build`. The older tsup packages fail that build, as [the build](../03-devops/01-build/00-build.md) explains, so expect errors from them. The second command runs `velnora dev` in [the example workspace](../01-products/02-example-workspace/00-example-workspace.md). The CLI runs from TypeScript source through Vite, so it doesn't need those builds. It logs the runtime it picked for each project and doesn't serve anything yet. Don't use the root `yarn dev`; it names a project that no longer exists.

## Finding your way

Every package's `package.json` scripts are its Nx targets, so `yarn nx show projects` lists the projects and `yarn nx show project @velnora/kernel` shows one's targets. Run a target through Nx with the package's full name, such as `yarn nx run @velnora/kernel:build`; [the Nx task rules](../../.claude/rules/code-style/nx-tasks.md) cover the details. What is broken across the workspace right now is in [`STATUS.md`](../../STATUS.md), so check it before assuming a failure is yours.

Running the tests is next, in [testing](01-testing.md).
