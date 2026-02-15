# Velnora — Overview

Velnora is a meta-framework and runtime orchestrator for micro-app architectures.
It discovers projects inside a Yarn-workspaces monorepo, then serves each one
under its own URL namespace through a single HTTP host.

## Principles

- **Clarity** — every layer has one job.
- **Craftsmanship** — typed contracts, 100 % test coverage on runtime paths.
- **Control** — the developer decides what runs; Velnora wires it together.

## Architecture layers

| Layer | Package            | Responsibility                                    |
| ----- | ------------------ | ------------------------------------------------- |
| 0     | `@velnora/kernel`  | Workspace detection, project discovery, Host boot |
| 0     | `@velnora/host`    | h3 HTTP server, per-project routing               |
| 0     | `@velnora/utils`   | Filesystem helpers, `Project` class               |
| 0     | `@velnora/types`   | Shared interfaces and utility types               |
| 3     | `@velnora/cli`     | CLI entry point (`velnora dev`)                    |
| —     | `@velnora/commands` | Command definitions and option types              |
| —     | `velnora`          | Public `defineConfig()` helper                    |

> Layers 1 (Adapters) and 2 (Composition) are planned but not yet implemented.

## How `velnora dev` works today

```
CLI  ──▶  createKernel()
            │
            ├─ init()
            │    ├─ detectWorkspace(cwd)   → finds workspace root
            │    └─ detectProjects(pkg)    → resolves workspace globs → Project[]
            │
            └─ bootHost(options)
                 ├─ new Host(projects, options)
                 │    ├─ registers  GET /{project.path}/**  per project
                 │    └─ registers  GET /  (project index)
                 └─ host.listen()  → http://localhost:3000
```

## Project model

A **Project** is discovered by scanning `package.json` files inside workspace
globs. The `Project` class (in `@velnora/utils`) provides:

| Getter        | Source                         | Example             |
| ------------- | ------------------------------ | ------------------- |
| `name`        | relative path from root        | `apps/web`          |
| `displayName` | `packageJson.name`             | `@acme/web`         |
| `path`        | `/${packageJson.name}`         | `/@acme/web`        |
| `root`        | absolute directory path        | `/repo/apps/web`    |
| `packageJson` | parsed `package.json`          | `{ name: "…", … }` |
| `config`      | `velnora.config.*` or `{}`     | `{ environments … }`|

## Configuration

Two config levels (both optional at this stage):

- **`VelnoraConfig`** — workspace root `velnora.config.ts`. Global settings.
- **`VelnoraAppConfig`** — per-project `velnora.config.ts`. Project-specific settings
  like environment overrides.

## Current milestone — v0.1

Goal: `velnora dev` starts an HTTP host that serves every discovered project
on `localhost:3000` under its own path.
