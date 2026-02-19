/**
 * The result of resolving a toolchain to a concrete binary on disk.
 *
 * Produced by {@link Toolchain.resolve} after inspecting the local
 * environment and determining which executable and version will be used
 * for subsequent lifecycle operations.
 */
export interface ResolvedToolchain {
  /**
   * Absolute path or bare command name of the resolved binary.
   *
   * @example "/usr/bin/java"
   * @example "dotnet"
   * @example "node"
   */
  binary: string;

  /**
   * Resolved semver version string of the binary.
   *
   * @example "21.0.2"
   * @example "8.0.100"
   */
  version: string;
}
