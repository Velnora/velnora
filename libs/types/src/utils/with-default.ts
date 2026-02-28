/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Represents a module that may expose its value via a `default` export.
 *
 * When dynamically importing a config file (e.g. via `jiti`), the resolved
 * module might be the value itself — or an object with a `default` key
 * wrapping the actual value. This utility type captures both shapes,
 * allowing consumers to safely unwrap the result.
 *
 * @example
 * ```typescript
 * // velnora.config.ts uses `export default { ... }`
 * type Mod = WithDefault<VelnoraAppConfig>;
 * // Mod = VelnoraAppConfig | { default: VelnoraAppConfig }
 * ```
 */
export type WithDefault<T> = T | { default: T };
