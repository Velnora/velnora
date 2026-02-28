/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { DependencyScope } from "./depdendency-scope";

/**
 * A dependency after version resolution.
 *
 * Unlike {@link Dependency}, which carries an unresolved version range, a
 * `ResolvedDependency` has a pinned version and a definitive scope. The
 * optional {@link ResolvedDependency.children | children} array forms a
 * recursive tree representing transitive dependencies.
 *
 * @see {@link Dependency} for the pre-resolution counterpart.
 * @see {@link DependencyScope} for the available lifecycle scopes.
 * @see {@link DependencyTree} for the top-level container of resolved nodes.
 *
 * @example
 * ```typescript
 * const resolved: ResolvedDependency = {
 *   name: "express",
 *   version: "4.18.2",
 *   scope: "runtime",
 *   children: [
 *     { name: "body-parser", version: "1.20.1", scope: "runtime" },
 *   ],
 * };
 * ```
 */
export interface ResolvedDependency {
  /** The fully-qualified package name. */
  name: string;
  /** The exact resolved version string (e.g. `"4.18.2"`). */
  version: string;
  /** The lifecycle scope this dependency was resolved under. */
  scope: DependencyScope;
  /** Transitive dependencies of this package, forming a recursive tree structure. */
  children?: ResolvedDependency[];
}
