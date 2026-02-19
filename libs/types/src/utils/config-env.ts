/**
 * Describes the current execution environment passed to configuration factory
 * functions.
 *
 * When a helper such as `defineRuntime` receives a **function** instead of a
 * plain object, that function is called with a `ConfigEnv` so it can branch
 * on the active CLI command or environment mode at configuration time.
 *
 * @example
 * ```typescript
 * import { defineRuntime } from "@velnora/utils";
 *
 * export default defineRuntime((env: ConfigEnv) => {
 *   return {
 *     name: "node",
 *     toolchain: env.command === "build"
 *       ? { compiler: "swc" }
 *       : { compiler: "tsc" },
 *   };
 * });
 * ```
 */
export interface ConfigEnv {
  /**
   * The CLI command that is currently being executed.
   *
   * - `"build"` — a production (or preview) build is being produced.
   * - `"serve"` — the development server is starting.
   */
  command: "build" | "serve";

  /**
   * The environment mode string resolved from CLI flags or configuration.
   *
   * Typical values are `"development"` and `"production"`, but consumers may
   * define arbitrary mode names (e.g. `"staging"`, `"test"`).
   */
  mode: string;
}
