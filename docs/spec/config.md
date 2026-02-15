# Configuration

Velnora uses a two-level configuration model that mirrors how TypeScript
projects handle `tsconfig.json` — a workspace-level base and per-project
overrides.

## Workspace config — `VelnoraConfig`

Defined in the workspace root as `velnora.config.ts` (or `.js` / `.json`).
Applies to the entire monorepo.

```ts
// velnora.config.ts
import { defineConfig } from "velnora";

export default defineConfig({
  // currently empty — will grow as workspace-level features are added
});
```

**Interface:** `VelnoraConfig` — currently an empty shell, reserved for
global settings like default ports, shared plugin registrations, etc.

## Project config — `VelnoraAppConfig`

Defined in each project directory as `velnora.config.ts`.
Controls project-specific behaviour.

```ts
export interface VelnoraAppConfig {
  environments?: Record<"dev" | "prod" | string, VelnoraEnvironment>;
}
```

- `environments` — optional map of environment-specific overrides.
  Keys `"dev"` and `"prod"` are suggested but any string is accepted.
- If no config file exists, the Kernel defaults to `{}`.

## Config resolution

1. `loadProjectConfig(dir)` checks for `velnora.config.ts`, `.js`, `.json`
   (in that order).
2. TypeScript / JS files are evaluated at runtime via `jiti`.
3. JSON files are parsed with `destr`.
4. If nothing is found → `{}`.

## `defineConfig()`

The public `velnora` package exposes `defineConfig()` for type-safe authoring:

```ts
import { defineConfig } from "velnora";
export default defineConfig({ /* autocomplete here */ });
```

## Validation

Type contracts live in `@velnora/types`. Runtime validation (Zod) is planned
but not yet wired.
