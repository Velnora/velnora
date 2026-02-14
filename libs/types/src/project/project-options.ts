import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "../config";

/** Raw inputs needed to construct a {@link Project}. */
export interface ProjectOptions {
  name: string;
  root: string;
  packageJson: PackageJson;
  config: VelnoraAppConfig;
}
