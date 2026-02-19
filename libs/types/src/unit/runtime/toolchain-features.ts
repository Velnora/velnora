/**
 * Capability flags a toolchain can advertise.
 *
 * Each boolean property indicates whether the toolchain supports a
 * particular feature. All flags are optional -- a missing flag is treated
 * as `false`. Extends the declaration-merged {@link Velnora.Toolchain.Features}
 * namespace so consumers can augment the set with custom capabilities.
 */
export interface ToolchainFeatures extends Velnora.Toolchain.Features {
  /**
   * Supports hot-reload / HMR during development.
   *
   * Typical runtimes: Node.js, JVM (via Spring DevTools). Rarely available
   * in compiled-to-native toolchains like Go.
   */
  hotReload?: boolean;

  /**
   * Supports incremental / partial builds that re-compile only changed
   * sources.
   *
   * Typical runtimes: JVM (Gradle), .NET (MSBuild), TypeScript (`tsc
   * --incremental`).
   */
  incrementalBuild?: boolean;

  /**
   * Can produce ahead-of-time compiled native images.
   *
   * Typical runtimes: JVM (GraalVM native-image), Go, Rust.
   */
  nativeImage?: boolean;

  /**
   * Supports monorepo / workspace layouts with multiple packages in one
   * repository.
   *
   * Typical runtimes: Node.js (Yarn/npm workspaces), JVM (Gradle
   * multi-module projects), .NET (solution files).
   */
  workspaces?: boolean;

  /**
   * The package manager produces a deterministic lockfile.
   *
   * Typical runtimes: Node.js (`yarn.lock`, `package-lock.json`), Rust
   * (`Cargo.lock`), Go (`go.sum`). JVM toolchains (Maven / Gradle) may
   * or may not produce lockfiles depending on configuration.
   */
  lockfile?: boolean;

  /**
   * Supports built-in vulnerability / security auditing of dependencies.
   *
   * Typical runtimes: Node.js (`npm audit`, `yarn audit`), Rust
   * (`cargo audit`). Less common in JVM and .NET ecosystems without
   * third-party plugins.
   */
  audit?: boolean;

  /**
   * Supports fetching packages from custom / private registries.
   *
   * Typical runtimes: Node.js (npm/Yarn registry config), JVM (Maven
   * Central mirrors, Artifactory), .NET (NuGet feeds), Rust (Cargo
   * alternate registries).
   */
  privateRegistry?: boolean;
}
