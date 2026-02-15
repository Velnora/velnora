# `velnora dev` — Specification

## Purpose

Start a development host that serves every project in the workspace.

## CLI surface

```
velnora dev [--port <number>] [--host <string>]
```

| Flag     | Default       | Description                    |
| -------- | ------------- | ------------------------------ |
| `--port` | `3000`        | Port for the HTTP host         |
| `--host` | `"localhost"` | Hostname to bind               |

Options are typed as `DevCommandOptions` from `@velnora/commands`.

## Execution flow

```
velnora dev --port 4000
  │
  ▼
CLI (libs/cli)
  ├─ parses argv via commander-like API
  └─ devCommand.action(options)
       │
       ▼
     createKernel()              → new Kernel()
     kernel.init()               → detectWorkspace + detectProjects
     kernel.bootHost(options)    → new Host(projects, options) → listen
```

### Step-by-step

1. **Parse CLI** — `@velnora/commands` defines the `devCommand` with its flags.
   The CLI wires it to an action handler.
2. **Create Kernel** — `createKernel()` returns a fresh `Kernel` instance.
3. **Init** — `kernel.init()` locates the workspace root, `chdir`s into it,
   and discovers all projects by expanding workspace globs.
4. **Boot Host** — `kernel.bootHost(options)` creates a `Host` with the
   discovered projects and the CLI-provided options, then starts listening.
5. **Serve** — The Host registers per-project routes and a root index.
   Logs each project's `displayName` and `path` to stdout.

## Output

```
[Velnora] Host running at http://localhost:4000
[Velnora] Serving 2 project(s):
  → @acme/web at /@acme/web
  → @acme/admin at /@acme/admin
```

## Routes

| Route                     | Response                            |
| ------------------------- | ----------------------------------- |
| `GET /`                   | JSON index of all projects          |
| `GET /{project.path}/**`  | Project-specific handler (stub)     |

## Error conditions

- **No workspace found** — `detectWorkspace` throws if no `package.json` with
  `workspaces` is found above `cwd`.
- **No projects discovered** — `bootHost` throws with a descriptive message.
