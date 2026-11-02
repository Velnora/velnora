---
title: DevOps
prev: "[[00-server-runtime]]"
next: "[[00-build]]"
covers:
  - nx.json
  - package.json
  - .github/workflows
  - .changeset
---

# DevOps

Velnora is a set of npm packages, so its DevOps is how those packages are built and released. There is no service to deploy, no database and no environment file. This chapter has two systems. [The build](01-build/00-build.md) is how a package goes from `src/main.ts` to the `build/` files its `exports` name. [CI and release](02-ci-and-release/00-ci-and-release.md) is the one GitHub Actions workflow that versions and publishes them.

Everything runs through Nx 22 over a Yarn 4.12 workspace. Each package's `package.json` scripts are its Nx targets, and the root [`nx.json`](../../nx.json) only adds shared behaviour. `build` depends on `^build`, so a package's dependencies build first. `build`, `lint`, `test`, `typecheck`, `format:check` and `check` are cached, with inputs that include `tsconfig.base.json`, `yarn.lock`, `biome.json` and `.editorconfig`. The workspaces are `packages/*`, `libs/*`, `libs/**/*`, `examples/*` and `docs`. The exact conventions for running targets are in [the Nx task rules](../../.claude/rules/code-style/nx-tasks.md).

Start with [the build](01-build/00-build.md).
