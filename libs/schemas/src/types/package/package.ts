import type { PackageJson } from "type-fest";
import type { EnvironmentOptions } from "vite";

import type { VelnoraAppConfig } from "../../schemas";
import type { PackageKind } from "./package-kind";

export interface Package {
  readonly id: string;
  readonly name: string;
  readonly root: string;
  readonly kind: PackageKind;
  getConfig(): Promise<VelnoraAppConfig>;

  readonly packageJson: PackageJson;
  readonly environmentOptions: Record<string, EnvironmentOptions>;
}
