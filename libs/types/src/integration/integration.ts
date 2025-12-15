import type { Promisable } from "type-fest";
import type { UserConfig } from "vite";

import type { VelnoraContext } from "../context";

/**
 * Represents a single integration unit within the Velnora framework.
 * Each integration encapsulates configuration, build, and runtime hooks
 * for extending Velnora’s client or server behavior dynamically.
 *
 * Integrations can represent frameworks (e.g., React, NestJS),
 * tooling (e.g., Biome, Vitest), or external service bindings.
 *
 * @example
 * ```ts
 * const reactIntegration: Integration = {
 *   name: "react",
 *   version: "19.0.0",
 *   supportsHost: "vite",
 *   target: "client",
 *   configure(ctx) {
 *     ctx.logger.info("Configuring React integration...");
 *   },
 *   build(ctx) {
 *     ctx.builder.addPlugin("vite-react");
 *   },
 * };
 * ```
 */
export interface Integration {
  /**
   * The unique, human-readable name of the integration.
   *
   * Used internally as the identifier when loading or resolving integrations.
   * Should be stable across versions (e.g., `"react"`, `"nest"`, `"graphql"`).
   */
  name: string;

  /**
   * Optional semantic version string of the integration.
   *
   * Primarily for version tracking, dependency resolution, or analytics.
   * This does not affect runtime execution but can help ensure compatibility.
   *
   * @example "1.0.3"
   */
  version?: string;

  /**
   * Additional Vite configuration contributed by the integration.
   *
   * Merged into the application's global Vite config during setup,
   * allowing the integration to extend the dev server and build pipeline
   * (e.g., plugins, aliases, transforms).
   */
  vite?: Pick<UserConfig, "plugins">;

  /**
   * Lifecycle filter: Determines whether this integration should run
   * for a specific package during the current command.
   *
   * This acts similarly to Vite’s `apply` or Rollup’s `resolveId` phase:
   * it is invoked **once per integration per package**, allowing the
   * integration to decide if it should participate in subsequent hooks
   * (`configure`, `scaffold`, `build`, `runtime`).
   *
   * Returning:
   * - `true`  → The integration applies to this package. All lifecycle hooks
   *              will be executed for this integration/package.
   * - `false` → The integration does *not* apply. All later hooks for this
   *              integration/package will be skipped entirely.
   *
   * Common use cases:
   * - Detecting whether a package has a `/client` or `/server` directory
   * - Checking for specific framework markers (e.g., React, NestJS)
   * - Filtering based on package metadata or workspace layout
   * - Reducing overhead by avoiding repeated checks inside every hook
   *
   * This gives plugin authors full control to self-filter their own
   * applicability once, instead of manually checking in every hook.
   *
   * @example
   * ```ts
   * apply(ctx) {
   *   // Only apply React integration to packages with a client folder
   *   return ctx.fs.exists(ctx.fs.join(ctx.pkg.root, "client"));
   * }
   * ```
   *
   * @param ctx - The Velnora execution context for this package, providing
   *              package metadata, file utilities, and global host references.
   * @returns Whether this integration should run for the given package.
   */
  apply?(ctx: VelnoraContext): boolean;

  /**
   * Lifecycle hook: Invoked before any scaffolding or build process begins.
   *
   * Common use cases:
   * - Modifying the context configuration
   * - Injecting environment variables
   * - Registering aliases or plugins before compilation
   *
   * Called once per integration during setup.
   *
   * @param ctx - The shared Velnora execution context, including project metadata,
   *              configuration, logger, and host references.
   */
  configure?(ctx: VelnoraContext): Promisable<void>;

  /**
   * Lifecycle hook: Handles creation or modification of base files
   * or structure required for this integration to function.
   *
   * Common use cases:
   * - Generating entry points, config files, or templates
   * - Initializing dependencies for first-time setup
   *
   * This is typically called after `configure` and before `build`.
   *
   * @param ctx - The active Velnora context providing access to file utilities,
   *              working directory, and environment info.
   */
  scaffold?(ctx: VelnoraContext): Promisable<void>;

  /**
   * Lifecycle hook: Executed during the build phase.
   *
   * Common use cases:
   * - Extending or mutating build pipelines
   * - Injecting custom Vite/Nx/NestJS plugins
   * - Performing compile-time optimizations
   *
   * Runs once per integration per build process.
   *
   * @param ctx - The Velnora build context containing builders,
   *              config resolvers, and active environment variables.
   */
  build?(ctx: VelnoraContext): Promisable<void>;

  /**
   * Lifecycle hook: Executed at runtime (after the system is fully built).
   *
   * Common use cases:
   * - Registering runtime hooks or middlewares
   * - Loading dynamic client/server modules
   * - Attaching monitoring or runtime behaviors
   *
   * Typically, invoked when the host application launches or hot-reloads.
   *
   * @param ctx - The runtime context providing references to live
   *              processes, watchers, and the host environment.
   */
  runtime?(ctx: VelnoraContext): Promisable<void>;
}
