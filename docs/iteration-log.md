# Iteration log

Chronological record of significant decisions and milestones.

---

## 2025-XX-XX — Repo scaffold

**Context:** Start from zero.

**Decision:** Create a Yarn 4 + Nx monorepo with `unbuild` for packaging.
Initial packages: `@velnora/types`, `@velnora/utils`, `@velnora/internal`.

**Trade-offs:** Leaves adapters, RPC, and codegen for later iterations.

---

## 2025-XX-XX — Kernel + Host + CLI wiring

**Context:** The CLI manually called `detectWorkspace` and `detectProjects`,
then logged the results. No HTTP server was started.

**Decision:** Introduced `@velnora/kernel` as the Layer 0 orchestrator.
The CLI now calls `createKernel() → init() → bootHost(options)`.
The Host is an h3-based HTTP server that registers per-project routes.

**What changed:**

- `@velnora/kernel` — new package with `Kernel` class and `createKernel()` factory.
- `@velnora/host` — new package with `Host` class (h3 + listhen).
- `@velnora/cli` — rewired to delegate to Kernel instead of manual utility calls.
- `DevCommandOptions` — shared type used by CLI, Kernel, and Host.
- `RequiredKeys<T, K>` — utility type added to `@velnora/types`.

**Tests:** 100 % coverage on Kernel. 110 total tests passing.

---

## 2025-XX-XX — Project class

**Context:** Projects were plain object literals (`{} satisfies Project`).
`displayName` and `path` were manually set at creation, leading to
duplication and no getter-based derivation.

**Decision:** Introduced a `Project` class in `@velnora/utils` that
implements the `Project` interface from `@velnora/types`. Derived
properties (`displayName`, `path`) are computed from `packageJson.name`.

**What changed:**

- `Project` class — constructor takes `ProjectOptions` (name, root, packageJson, config).
- `parseProjectEntry` — returns `new Project(...)` instead of an object literal.
- `Project` interface — added `path` field for URL routing.
- `Host` — uses `project.path` for route registration.
- `loadProjectConfig` — removed `as VelnoraAppConfig` cast (unnecessary since all fields are optional).

**Tests:** 110 total tests passing, no type errors.
