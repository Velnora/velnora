/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { ResolvedDependency } from "./resolved-dependency";

/**
 * A hierarchical dependency graph returned by {@link PackageManager.list}.
 *
 * Represents the full tree of resolved dependencies for a project, including
 * transitive children nested within each {@link ResolvedDependency} node.
 *
 * @see {@link ResolvedDependency} for the recursive node structure.
 * @see {@link PackageManager.list} for the method that produces this tree.
 *
 * @example
 * ```typescript
 * const tree: DependencyTree = await pm.list();
 *
 * for (const dep of tree.dependencies) {
 *   console.log(`${dep.name}@${dep.version} (${dep.children?.length ?? 0} transitive)`);
 * }
 * ```
 */
export interface DependencyTree {
  /** The top-level resolved dependencies of the project. */
  dependencies: ResolvedDependency[];
}
