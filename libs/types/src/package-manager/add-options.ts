import type { DependencyScope } from "./depdendency-scope";

/**
 * Options for adding new dependencies to a project.
 *
 * Passed to {@link PackageManager.add} to control how the dependency is
 * recorded in the project manifest.
 *
 * @example
 * ```typescript
 * await pm.add(
 *   [{ name: "lodash", version: "^4.17.0" }],
 *   { scope: "runtime", exact: true }
 * );
 * ```
 */
export interface AddOptions {
  /** The lifecycle scope under which the dependency should be installed. */
  scope?: DependencyScope;
  /** When `true`, pin the exact version instead of a semver range. */
  exact?: boolean;
}
