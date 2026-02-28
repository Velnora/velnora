/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Classifies how a dependency is used within a project.
 *
 * The scope determines at which lifecycle phase the dependency is needed and
 * whether it should be included in the final production artifact.
 *
 * Inspired by Maven/Gradle scopes but generalised across all supported
 * runtimes (JVM, Node, .NET, Go, etc.).
 *
 * | Scope        | Included at compile | Included at runtime | Bundled |
 * |:------------ |:-------------------:|:-------------------:|:-------:|
 * | `runtime`    | yes                 | yes                 | yes     |
 * | `dev`        | yes                 | no                  | no      |
 * | `test`       | test only           | no                  | no      |
 * | `provided`   | yes                 | expected externally | no      |
 *
 * @example
 * ```typescript
 * const dep: Dependency = { name: "vitest", version: "^4.0.0", scope: "test" };
 * ```
 */
export type DependencyScope =
  | "runtime" // production dependency
  | "dev" // development only
  | "test" // test only
  | "provided"; // JVM concept — expected at runtime but not bundled
