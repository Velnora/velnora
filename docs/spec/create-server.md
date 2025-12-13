# `createDevServer(opts)` / `createPreviewServer(opts)` — Specification

## 1) Purpose

Spin up a **framework-agnostic appSchema host** in development (and, analogously, production) by:

* Loading user config
* Discovering and planning integrations
* Composing the build system (Vite) and runtime (server + client)
* Assembling an internal server bootstrap (no user `main.ts`)
* Serving SSR/CSR apps with HMR (dev only)

> Non-goals: project scaffolding beyond idempotent minimums; publishing; production containerization.

---

## 2) Inputs & Outputs

### Inputs

* **CLI/Programmatic options** (`DevCommandOptions`):

    * `port` (number, default `3000`)
    * `watch` (boolean, default `true`)
    * (reserved) `open`, `host`, `strictCapabilities`, `logLevel`
* **User config file**: `velnora.config.(ts|mjs|cjs|json)`

    * `integrations: Array<[string, Record<string, unknown>]>`
    * (optional) `dev: { port?: number, watch?: boolean }`

### Outputs (side effects)

* Running **HTTP server** (Nest integrationSchema assembles bootstrap internally)
* Running **Vite dev server** with HMR (dev)
* Logs: plan, capability graph, vite plugin pipeline, entrypoints table
* (dev) Generated cache artifacts under `.velnora/` (see §7)

---

## 3) High-Level Pipeline

```
createDevServer(opts)
  1) Resolve runtime options (opts ⟵ config.dev ⟵ defaults)
  2) Load & validate user config (@velnora/schemas)
  3) Discover integrations (resolve packages, read their manifests)
  4) Plan:
     a. Build capability graph (provides/requires)
     b. Topo-sort & order per stage
     c. Preflight checks (conflicts & unmet requirements)
  5) Execute hooks by stage:
     a. configure  → declare capabilities, minimal settings
     b. scaffold   → (idempotent) ensure minimal files/dirs
     c. build      → collect vite plugins, aliases, virtuals; deps (dev only: print)
     d. runtime    → register server/client entrypoints
  6) Compose Vite from collected build intents (@velnora/vite-integrationSchema)
  7) Assemble server bootstrap from entrypoints (@velnora/integrations-nest)
  8) Start:
     a. start Vite dev server (middleware exposed)
     b. start server bootstrap (mount vite middleware; wire SSR dispatcher)
  9) Observe: wire RPC channels, health, HMR, status
```

---

## 4) Lifecycle Stages (contract)

| Stage       | Purpose                                              | Ordering                                             | Typical actions                                                                     |
|-------------|------------------------------------------------------|------------------------------------------------------|-------------------------------------------------------------------------------------|
| `configure` | Declare **capabilities**, read options, set defaults | topo (requires→provides), then `priority`, then name | set `http:server` (Nest); set `ui:render:ssr` (React/Vue/Angular)                   |
| `scaffold`  | Ensure idempotent **project skeleton** (opt-in)      | same                                                 | create `apps/*/src` if missing; write sample `index.html`/`app.tsx` only if absent  |
| `build`     | Collect **build intents**                            | same                                                 | register Vite plugins, aliases, virtual modules; (dev) print deps                   |
| `runtime`   | Register **entrypoints**                             | same                                                 | server: `http:ssr`, `http:middleware`; client: `ui:csr-root`, `ui:ssr-hydrate-root` |

> Transactions: Core batches intents; file writes idempotent; dev mode prefers **virtual** artifacts over persistent ones.

---

## 5) Subsystems & Responsibilities

* **`@velnora/core`**

    * Owns lifecycle execution, capability graph, conflict detection
    * Exposes context to integrations (pkg/vite/fs/entrypoints/capabilities)
* **`@velnora/vite-integrationSchema`**

    * Composes Vite config from collected plugin factories, aliases, virtuals
    * Launches Vite server; exposes middleware to runtime server
* **`@velnora/integrations-nest` (as integrationSchema)**

    * Provides `http:server`
    * Generates **internal bootstrap** moduleSchema from server entrypoints
    * Starts HTTP server; mounts Vite middleware in dev
* **`@velnora/runtime-client`**

    * Consumes client entrypoints; mounts/hydrates
* **`@velnora/rpc`**

    * Dev channels (HMR/overlay/status) as needed
* **`@velnora/schemas`**

    * Zod schemas for config, manifests, entrypoints

> **`@velnora/internal`**: build-only package config (tsup/esbuild); **never** imported here.

---

## 6) Capability & Entrypoint Rules

* **Capabilities** (examples):
  `http:server`, `nest:di`, `ui:framework`, `ui:routes`, `ui:render:csr`, `ui:render:ssr`, `build:vite-plugin`
* **Requirements**: UI SSR **requires** `http:server`
* **Entrypoints**:

    * Server: `http:ssr`, `http:middleware`, `http:controller`, `job:schedule`
    * Client: `ui:csr-root`, `ui:ssr-hydrate-root`, `ui:route-manifest`
* **Constraints**:

    * At most **one `http:ssr` per `{appSchema}`** (conflict → error)
    * Middleware ordered by `order` (tie break: package name)
    * Controller route+method collisions → error

---

## 7) Files & Artifacts (affected)

### Read (userland)

* `velnora.config.(ts|mjs|cjs|json)` — root config
* `package.json` — (dev: read only; prod build may write via planner)
* Existing appSchema files (only to **check** existence):
  `apps/<appSchema>/src/**`, `apps/<appSchema>/index.html`, `tsconfig.json`

### Write (dev mode; minimal & reversible)

* **Prefer virtual modules** via Vite where possible
* **On-disk cache** under `.velnora/`:

    * `.velnora/cache/plan.json` — dry-run plan (integrations, capabilities, vite pipeline, entrypoints)
    * `.velnora/generated/vite.config.generated.ts` — synthesized Vite config (optional; can be in-memory)
    * `.velnora/generated/server/bootstrap.generated.ts` — **internal** Nest bootstrap (never committed)
    * `.velnora/logs/dev-*.log` — optional structured logs
* **Idempotent scaffolds** (only if missing):

    * `apps/<appSchema>/src/App.(tsx|vue|ts)` — minimal shell
    * `apps/<appSchema>/src/main.(tsx|ts)` — CSR/Hydrate mount
    * `apps/<appSchema>/index.html` — HTML shell
    * `apps/server/src/` — typically avoided; bootstrap is **virtual/generated**

> Production build may allow controlled writes/patches (e.g., lockfiles, manifests), but **dev** should not mutate user `package.json` or `tsconfig.json` unless a deliberate “apply” command is run.

---

## 8) Error Handling & Diagnostics

* **Planning errors** (fail fast, no I/O):

    * Missing required capability (e.g., SSR without `http:server`)
    * Duplicate `http:ssr` for the same `{appSchema}`
    * Route collisions
* **Execution errors**:

    * Vite composition failure → report offending plugin/package
    * Bootstrap assembly failure → list unresolved entrypoints
* **Diagnostics output**:

    * Capability graph table
    * Ordered stage execution log
    * Vite plugins (ordered)
    * Entrypoints (server & client) by appSchema
    * Ports and URLs (server, Vite, proxies)

---

## 9) Observability

* Standard logs: `info`, `warn`, `error`
* Optional JSON logs to `.velnora/logs`
* Health endpoint (dev):
  `GET /__velnora/health` → `{ server: "up", vite: "up", apps: [...] }`
* Plan dump: `.velnora/cache/plan.json`

---

## 10) Dev vs Prod Differences (preview)

| Concern     | Dev (`createDevServer`)          | Prod (`createServer`)                         |
|-------------|----------------------------------|-----------------------------------------------|
| Vite        | dev server + HMR                 | build artifacts only                          |
| Writes      | virtual + `.velnora/generated/*` | real build output (dist)                      |
| Deps        | **printed only**                 | may be applied in a dedicated “apply” command |
| Source maps | inline                           | external                                      |
| Bootstrap   | generated each run               | generated at build, embedded in dist          |

---

## 11) Success Criteria (Definition of Done)

* CLI `dev` starts one HTTP server and one Vite server; both ports logged.
* Plan printed & written to `.velnora/cache/plan.json`.
* Capability validation catches unmet requirements before starting servers.
* Vite plugin pipeline is ordered deterministically and logged.
* Entrypoints table shows:

    * For each `appSchema`: either SSR handler (server) or CSR root (client), with paths.
* No user `main.ts` for Nest; bootstrap is generated under `.velnora/generated/…`.
* No usage of `@velnora/internal` at runtime anywhere.

---

## 12) Open Questions (to resolve later)

* Should dev server auto-open browser based on config?
* Hot-restart policy when integrations change? (restart server vs. soft reload)
* Multi-port vs single-port strategy for multi-appSchema SSR (path vs header routing)
* Auth/security middlewares in dev (CORS/Helmet defaults)

---

### Appendix A — Minimal Sequence (ASCII)

```
velnora dev
  → @velnora/core.createDevServer
    → load config (@velnora/schemas)
    → resolve integrations
    → plan capabilities (toposort)
    → run hooks: configure → scaffold → build → runtime
      • collect vite plugins, aliases, virtuals
      • collect entrypoints (server/client)
    → @velnora/vite-integrationSchema.start()
      • start Vite, expose middleware
    → @velnora/integrations-nest.bootstrap()
      • generate server bootstrap from entrypoints
      • mount Vite middleware
      • listen on port
    → serve + HMR + logs
```
