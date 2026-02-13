/**
 * Per-project Velnora configuration.
 *
 * Defined in a project-level `velnora.config.ts` (or `.js` / `.json`).
 * Controls project-specific settings such as the adapter to use,
 * build targets, or custom plugin options.
 *
 * If a project does not have a `velnora.config.*` file, the Kernel
 * defaults this to an empty object (`{}`), so downstream consumers
 * can always access it without null checks.
 *
 * Used by `defineConfig()` in the `velnora` package to provide
 * type-safe authoring of project configuration files.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VelnoraAppConfig {}
