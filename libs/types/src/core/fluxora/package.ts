import { PackageJson } from "type-fest";

import type { AppType } from "../app-type";

export interface Package {
  type: AppType;
  root: string;
  name: string;
  packageJson: PackageJson;
}
