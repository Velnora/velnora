# Runtime — Kernel and Host

This document describes how a Velnora workspace is booted at runtime.

## Kernel lifecycle

The **Kernel** (`@velnora/kernel`) is the entry point for all runtime
operations. It follows a strict three-phase lifecycle:

### 1. `init()`

Discovers the workspace and its projects.

1. Calls `detectWorkspace(process.cwd())` — walks up the directory tree until
   it finds a `package.json` with a `workspaces` field.
2. Changes `process.cwd()` to the workspace root so all subsequent paths are
   resolved relative to it.
3. Calls `detectProjects(rootPackageJson)` — expands workspace globs via
   `fast-glob`, reads each `package.json`, loads optional `velnora.config.*`,
   and returns a `Project[]`.

### 2. `bootHost(options?)`

Starts the HTTP server.

1. Guards against calling before `init()` (throws if no projects discovered).
2. Creates a `Host` with the discovered projects and optional CLI options
   (`host`, `port`).
3. The Host registers routes and starts listening.

### 3. `shutdown()`

Gracefully tears down the Host. Idempotent — safe to call multiple times.

## Host

The **Host** (`@velnora/host`) is an h3-based HTTP server.

- Each project is mounted at its `path` (e.g. `/@acme/web/**`).
- The root route (`GET /`) returns a JSON index of all registered projects.
- Defaults: `localhost:3000`. Overridable via `--host` and `--port` CLI flags.

## Project discovery pipeline

```
workspace root
  └─ package.json  →  workspaces: ["apps/*", "libs/*"]
       │
       ├─ fast-glob  →  apps/web/package.json
       │                 apps/admin/package.json
       │                 libs/shared/package.json
       │
       └─ for each package.json:
            ├─ parse name, root, packageJson
            ├─ loadProjectConfig(dir)  →  velnora.config.ts | {}
            └─ new Project({ name, root, packageJson, config })
```

Projects without a `name` field in `package.json` are skipped with a warning.

## Dependency flow

```
@velnora/cli
  └─ @velnora/kernel
       ├─ @velnora/utils   (detectWorkspace, detectProjects, Project)
       ├─ @velnora/host    (Host)
       └─ @velnora/commands (DevCommandOptions)
```
