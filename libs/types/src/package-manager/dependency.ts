import type { DependencyScope } from "./depdendency-scope";

/**
 * A dependency declaration before resolution.
 *
 * Describes a package that should be added to (or queried within) a project.
 * At this stage the version is an unresolved range or tag, and the scope and
 * registry are optional hints for the package manager.
 *
 * @see {@link ResolvedDependency} for the post-resolution counterpart.
 * @see {@link DependencyScope} for the available lifecycle scopes.
 * @see {@link PackageManager.add} for the method that consumes this type.
 *
 * @example
 * ```typescript
 * const dep: Dependency = {
 *   name: "express",
 *   version: "^4.18.0",
 *   scope: "runtime",
 * };
 * ```
 */
export interface Dependency {
  /** The package name (e.g. `"lodash"`, `"org.slf4j:slf4j-api"`). */
  name: string;
  /** An optional semver range, tag, or version specifier (e.g. `"^4.17.0"`, `"latest"`). */
  version?: string;
  /** The lifecycle scope under which the dependency should be installed. */
  scope?: DependencyScope;
  /** A custom registry URL to fetch this dependency from, overriding the default. */
  registry?: string;
}
