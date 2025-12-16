import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { glob } from "glob";
import _ from "lodash";
import type { PackageJson } from "type-fest";

import { velnoraAppConfigSchema } from "@velnora/contracts";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Node as NodeClient } from "@velnora/devkit";
import { type Package, PackageKind, type VelnoraAppConfig, type VelnoraConfig } from "@velnora/types";

import { VelnoraConfigError } from "../error/velnora-config-error";
import { loadConfigFile } from "../utils";

export class Node extends NodeClient implements Package {
  constructor(root: string, packageJson: PackageJson, rootConfig: VelnoraConfig) {
    super(root, packageJson, rootConfig);
  }

  get kind() {
    if (this.config.kind) {
      return this.config.kind;
    }

    if (existsSync(resolve(this.root, "client")) && existsSync(resolve(this.root, "server"))) {
      return PackageKind.App;
    }

    if (existsSync(resolve(this.root, "client"))) {
      return PackageKind.Module;
    }

    if (existsSync(resolve(this.root, "server"))) {
      return PackageKind.Service;
    }

    if (
      !!(this.packageJson.main || this.packageJson.module || this.packageJson.exports) &&
      glob.sync(`src/{main,index}.*`, { cwd: this.root }).length > 0
    ) {
      return PackageKind.Lib;
    }

    return PackageKind.Unknown;
  }

  async fetchConfig() {
    if (this._config) return this._config;
    const config = await loadConfigFile<VelnoraAppConfig>(resolve(this.root, "velnora.config"));
    const result = velnoraAppConfigSchema.safeParse(config);
    if (result.success) {
      this._config = result.data;
      return this._config;
    }

    throw new VelnoraConfigError(this.name, result.error);
  }

  toJSON() {
    return {
      $v: 1,
      id: this.id,
      root: this.root,
      kind: this.kind,
      packageJson: this.packageJson,
      config: _.omit(this.rootConfig, "integrations"),
      appConfig: this.config,
      lastUpdatedTime: statSync(resolve(this.root, "package.json")).mtimeMs
    };
  }
}
