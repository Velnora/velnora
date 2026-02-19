import type { PackageManager } from "../../package-manager";
import type { Project } from "../../project";
import type { Artifact } from "../../utils";
import type { CompileResult } from "./compile-result";
import type { ExecuteOptions } from "./execute-options";
import type { ProcessHandle } from "./process-handle";
import type { ResolvedToolchain } from "./resolved-toolchain";
import type { TestResult } from "./test-result";
import type { ToolchainContext } from "./toolchain-context";
import type { ToolchainFeatures } from "./toolchain-features";
import type { ToolchainProcess } from "./toolchain-process";

/**
 * The core abstraction for a language runtime's build / run / test
 * lifecycle.
 *
 * Each supported runtime (Node.js, JVM, .NET, Go, ...) is represented by
 * a single `Toolchain` implementation that knows how to detect, resolve,
 * compile, execute, test, and package projects for that runtime.
 *
 * @see {@link ToolchainProcess} for the streaming handle returned by
 *   lifecycle methods.
 * @see {@link PackageManager} for the dependency-management counterpart.
 * @see {@link ToolchainFeatures} for the capability flags a toolchain
 *   can advertise.
 */
export interface Toolchain {
  // ── Identity ──────────────────────────────────────────────────────

  /**
   * Unique, short identifier for this toolchain.
   *
   * @example "jvm"
   * @example "dotnet"
   * @example "node"
   * @example "go"
   */
  name: string;

  /**
   * Primary language or platform this toolchain targets.
   *
   * @example "java"
   * @example "kotlin"
   * @example "csharp"
   * @example "typescript"
   */
  runtime: string;

  // ── Resolution ────────────────────────────────────────────────────

  /**
   * Probes the given directory to determine whether this toolchain can
   * handle the project located there (e.g. by checking for a
   * `pom.xml`, `package.json`, or `go.mod`).
   *
   * @param cwd - Absolute path to the project root.
   * @returns `true` if the toolchain recognises the project layout.
   */
  detect(cwd: string): Promise<boolean>;

  /**
   * Resolves the toolchain to a concrete binary and version on the
   * current machine.
   *
   * @param ctx - Ambient context including the working directory.
   * @returns The resolved binary path and its semver version.
   */
  resolve(ctx: ToolchainContext): Promise<ResolvedToolchain>;

  // ── Lifecycle ─────────────────────────────────────────────────────

  /**
   * Compiles (builds) the project, producing output in
   * {@link CompileResult.outputDir}.
   *
   * @param project - The project to compile.
   * @returns A streaming process handle that resolves to a
   *   {@link CompileResult}.
   */
  compile(project: Project): ToolchainProcess<CompileResult>;

  /**
   * Starts the project as a long-running process (e.g. a dev server).
   *
   * @param project - The project to run.
   * @param opts - Optional execution overrides (port, args, env, watch).
   * @returns A streaming process handle that resolves to a
   *   {@link ProcessHandle}.
   */
  execute(project: Project, opts?: ExecuteOptions): ToolchainProcess<ProcessHandle>;

  /**
   * Runs the project's test suite.
   *
   * @param project - The project whose tests to run.
   * @returns A streaming process handle that resolves to a
   *   {@link TestResult}.
   */
  test(project: Project): ToolchainProcess<TestResult>;

  /**
   * Packages the project into a distributable artifact (JAR, tgz,
   * binary, etc.).
   *
   * @param project - The project to package.
   * @returns A streaming process handle that resolves to an
   *   {@link Artifact}.
   */
  package(project: Project): ToolchainProcess<Artifact>;

  // ── Package Management ────────────────────────────────────────────

  /**
   * The set of package managers this toolchain ships with or supports.
   *
   * A single toolchain may expose multiple managers (e.g. Node.js
   * supports npm, Yarn, and pnpm).
   */
  packageManagers: PackageManager[];

  /**
   * Detects and returns the active package manager for the project at
   * the given path.
   *
   * @param cwd - Absolute path to the project root.
   * @returns The {@link PackageManager} instance that matches the
   *   project's lockfile or manifest.
   */
  resolvePackageManager(cwd: string): Promise<PackageManager>;

  // ── Optional Extensions ───────────────────────────────────────────

  /**
   * Capability flags describing optional features this toolchain
   * supports.
   *
   * @see {@link ToolchainFeatures} for the full list of flags.
   */
  features?: ToolchainFeatures;
}
