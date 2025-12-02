import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "../../schemas";
import type { PackageKind } from "./package-kind";
import type { Version } from "./version";

export interface Package {
  readonly id: string;
  readonly name: string;
  readonly root: string;
  readonly kind: PackageKind;
  readonly config: VelnoraAppConfig;
  readonly version: Version;
  readonly clientPath: string;
  readonly serverPath: string;
  readonly isHostApplication: boolean;

  fetchConfig(): Promise<VelnoraAppConfig>;

  readonly packageJson: PackageJson;
}
