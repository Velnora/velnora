import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "../config";
import type { PackageKind } from "./package-kind";
import type { Version } from "./version";

export interface Package {
  readonly root: string;

  readonly id: string;
  readonly name: string;
  readonly basename: string;

  readonly version: Version;
  readonly config: VelnoraAppConfig;
  readonly kind: PackageKind;
  readonly isHostApplication: boolean;
  readonly clientUrl: string;
  readonly serverUrl: string;

  fetchConfig(): Promise<VelnoraAppConfig>;

  readonly packageJson: PackageJson;
}
