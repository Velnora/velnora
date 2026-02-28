/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * The result of checking project dependencies for newer available versions.
 *
 * Returned by {@link PackageManager.outdated} and contains an array of
 * packages whose installed version differs from the latest or wanted version.
 *
 * @see {@link PackageManager.outdated} for the method that produces this result.
 *
 * @example
 * ```typescript
 * const result: OutdatedResult = await pm.outdated();
 *
 * for (const pkg of result.packages) {
 *   console.log(`${pkg.name}: ${pkg.current} -> ${pkg.latest} (wanted: ${pkg.wanted})`);
 * }
 * ```
 */
export interface OutdatedResult {
  /**
   * The list of packages that have newer versions available.
   *
   * Each entry contains the package name alongside its current, latest, and
   * wanted version strings.
   */
  packages: {
    /** The package name. */
    name: string;
    /** The currently installed version. */
    current: string;
    /** The newest version available in the registry. */
    latest: string;
    /** The highest version that satisfies the declared semver range. */
    wanted: string;
  }[];
}
