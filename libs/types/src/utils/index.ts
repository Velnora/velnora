/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/types
 * layer: core
 * visibility: public
 */
/**
 * Shared utility types and ambient declarations used across the Velnora type
 * system.
 *
 * Re-exports:
 * - {@link Artifact} — build output descriptor produced by `Toolchain.package`.
 * - {@link ConfigEnv} — execution environment for configuration factories.
 * - {@link RequiredKeys} — helper that narrows optional keys to required.
 *
 * Also imports the global {@link Velnora} namespace side-effect module so that
 * declaration-merging is available to every consumer of `@velnora/types`.
 *
 * @module
 */
import "./velnora";

export * from "./artifact";
export * from "./config-env";
export * from "./required-keys";
