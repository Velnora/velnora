# ADR-0001: Package roles

## Context

We need clear boundaries between packages so each one has a single reason to
change and dependencies flow in one direction.

## Decision

| Package             | Role                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| `velnora`           | Public API — `defineConfig()` helper for end users                         |
| `@velnora/cli`      | CLI entry point — parses argv, delegates to Kernel                         |
| `@velnora/commands` | Command definitions — `devCommand`, `DevCommandOptions`                    |
| `@velnora/kernel`   | Orchestrator — workspace init, project discovery, Host boot                |
| `@velnora/host`     | HTTP server — h3-based, per-project routing                                |
| `@velnora/utils`    | Helpers — `detectWorkspace`, `detectProjects`, `Project` class             |
| `@velnora/types`    | Shared contracts — `Project` interface, config types, utility types        |
| `@velnora/tests`    | Shared test utilities                                                      |
| `@velnora/internal` | **Build-only** — unbuild configs, Nx generators. Never imported at runtime |

## Dependency direction

```
@velnora/cli  →  @velnora/kernel  →  @velnora/utils
                                  →  @velnora/host
                                  →  @velnora/commands
                       ↓
                  @velnora/types  (used by all)
```

## Trade-offs

- `@velnora/kernel` and `@velnora/host` both import `DevCommandOptions` from
  `@velnora/commands`. This means a Kernel-layer package depends on a
  CLI-adjacent package. We accepted this to avoid duplicating option types.
- `@velnora/utils` exports the `Project` class but `@velnora/types` owns the
  `Project` interface. The class is an implementation detail of the utils
  layer; consumers type against the interface.
