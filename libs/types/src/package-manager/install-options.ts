/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Options that control how {@link PackageManager.install} resolves and
 * installs dependencies.
 *
 * Both flags are optional and default to `false` when omitted.
 *
 * @see {@link PackageManager.install} for the method that accepts these options.
 *
 * @example
 * ```typescript
 * // CI-safe install: use the lockfile exactly, skip dev dependencies
 * await pm.install({ frozen: true, production: true });
 * ```
 */
export interface InstallOptions {
  /** When `true`, use the lockfile exactly and fail if it is out of sync with the manifest. */
  frozen?: boolean;
  /** When `true`, skip development dependencies and install only production ones. */
  production?: boolean;
}
