import type { AddOptions } from "./add-options";

import type { Artifact } from "../utils/artifact";
import type { AuditResult } from "./audit-result";
import type { Dependency } from "./dependency";
import type { DependencyTree } from "./dependency-tree";
import type { InstallOptions } from "./install-options";
import type { OutdatedResult } from "./outdated-result";

/**
 * The main abstraction for package management across runtimes.
 *
 * Provides a unified interface that works with any package manager regardless
 * of the underlying runtime — npm, yarn, pnpm (Node), maven, gradle (JVM),
 * nuget (.NET), cargo (Rust), and others.
 *
 * The interface is split into three tiers:
 * 1. **Core operations** (required) — {@link PackageManager.install | install}
 *    and {@link PackageManager.list | list}.
 * 2. **Mutation operations** (optional) — {@link PackageManager.add | add} and
 *    {@link PackageManager.remove | remove}. Not all package managers expose
 *    CLI commands for these.
 * 3. **Analysis operations** (optional) — {@link PackageManager.publish | publish},
 *    {@link PackageManager.audit | audit}, and
 *    {@link PackageManager.outdated | outdated}.
 *
 * @see {@link Dependency} for unresolved dependency declarations.
 * @see {@link DependencyTree} for the resolved dependency graph.
 * @see {@link InstallOptions} for install-time configuration.
 * @see {@link AddOptions} for dependency addition configuration.
 *
 * @example
 * ```typescript
 * const pm: PackageManager = detectPackageManager(cwd);
 *
 * await pm.install({ frozen: true });
 * const tree = await pm.list();
 *
 * if (pm.audit) {
 *   const result = await pm.audit();
 *   console.log(`Found ${result.summary.critical} critical vulnerabilities`);
 * }
 * ```
 */
export interface PackageManager {
  /** Human-readable identifier for this package manager (e.g. `"npm"`, `"maven"`, `"nuget"`, `"cargo"`). */
  name: string;
  /** The toolchain / runtime this package manager belongs to (e.g. `"node"`, `"jvm"`, `"dotnet"`, `"rust"`). */
  runtime: string;

  // ── Resolution ───────────────────────────────────────────────────────

  /**
   * Detect whether this package manager is in use within the given directory.
   *
   * Typically checks for the presence of a manifest or lockfile.
   *
   * @param cwd - The working directory to inspect.
   * @returns `true` if this package manager manages the project at `cwd`.
   */
  detect(cwd: string): Promise<boolean>;
  /**
   * Resolve the absolute path to the package manager binary.
   *
   * @returns The filesystem path to the executable.
   */
  resolveBinary(): Promise<string>;

  // ── Manifest & Lockfile ──────────────────────────────────────────────

  /** The canonical manifest filename (e.g. `"package.json"`, `"build.gradle.kts"`, `"*.csproj"`). */
  manifestName: string;
  /** The lockfile filename, if the package manager supports one (e.g. `"yarn.lock"`, `"gradle.lockfile"`). */
  lockfileName?: string;

  // ── Core operations (required) ───────────────────────────────────────

  /**
   * Install all dependencies declared in the project manifest.
   *
   * @param opts - Optional flags that control the install behaviour.
   * @see {@link InstallOptions}
   */
  install(opts?: InstallOptions): Promise<void>;
  /**
   * Build and return the full resolved dependency tree.
   *
   * @returns A {@link DependencyTree} containing every resolved dependency.
   */
  list(): Promise<DependencyTree>;

  // ── Mutation operations (optional) ───────────────────────────────────

  /**
   * Add one or more dependencies to the project manifest.
   *
   * Optional — not all package managers expose a CLI command for this.
   *
   * @param deps - The dependencies to add.
   * @param opts - Options controlling scope and version pinning.
   * @see {@link Dependency}
   * @see {@link AddOptions}
   */
  add?(deps: Dependency[], opts?: AddOptions): Promise<void>;
  /**
   * Remove one or more dependencies from the project manifest by name.
   *
   * Optional — not all package managers expose a CLI command for this.
   *
   * @param deps - An array of package names to remove.
   */
  remove?(deps: string[]): Promise<void>;

  // ── Analysis operations (optional) ───────────────────────────────────

  /**
   * Publish a build artifact to a registry.
   *
   * @param artifact - The artifact to publish.
   * @see {@link Artifact}
   */
  publish?(artifact: Artifact): Promise<void>;
  /**
   * Run a security audit against the current dependency tree.
   *
   * @returns An {@link AuditResult} with all discovered vulnerabilities.
   */
  audit?(): Promise<AuditResult>;
  /**
   * Check for outdated dependencies.
   *
   * @returns An {@link OutdatedResult} listing packages with newer versions.
   */
  outdated?(): Promise<OutdatedResult>;
}
