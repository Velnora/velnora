/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "../config";

/**
 * Raw inputs needed to construct a {@link Project}.
 *
 * Consumers pass a `ProjectOptions` object to the project factory, which
 * resolves derived fields (`displayName`, `path`) and returns a fully
 * populated {@link Project} instance.
 */
export interface ProjectOptions {
  /** Stable, path-based identifier for the project within the workspace. */
  name: string;

  /** Absolute path to the project's root directory. */
  root: string;

  /** Parsed contents of the project's `package.json`. */
  packageJson: PackageJson;

  /** Resolved per-project Velnora configuration. */
  config: VelnoraAppConfig;
}
