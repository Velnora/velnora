import { existsSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";

import { glob } from "glob";
import { parse } from "semver";
import type { PackageJson } from "type-fest";
import { v4 as uuidv4 } from "uuid";

import { velnoraAppConfigSchema } from "@velnora/contracts";
import { type Package, PackageKind, type VelnoraAppConfig, type VelnoraConfig } from "@velnora/types";

import { VelnoraConfigError } from "../error/velnora-config-error";
import { loadConfigFile } from "../utils";

export class Node implements Package {
  private readonly _id = uuidv4();

  constructor(
    readonly root: string,
    readonly packageJson: PackageJson,
    private readonly rootConfig: VelnoraConfig
  ) {}

  declare private _config: VelnoraAppConfig;

  get id() {
    return this._id;
  }

  get name() {
    return this.packageJson.name || this.basename;
  }

  get basename() {
    return basename(this.root);
  }

  get version(): Package["version"] {
    const pkgVersion = this.packageJson.version || "1.0.0";
    const semverVersion = parse(pkgVersion);

    return {
      full: pkgVersion,
      major: semverVersion ? semverVersion.major : 1,
      minor: semverVersion ? semverVersion.minor : 0,
      patch: semverVersion ? semverVersion.patch : 0,
      prerelease: semverVersion ? semverVersion.prerelease.join(".") : ""
    };
  }

  get config() {
    return this._config;
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

  get isHostApplication() {
    return [this.packageJson.name, this.basename].includes(this.rootConfig.hostApp);
  }

  get clientUrl() {
    return this.config.client?.url || (this.isHostApplication ? "/" : `/${this.basename}`);
  }

  get serverUrl() {
    const routePath = this.config.server?.url;
    return typeof routePath === "string" ? routePath : routePath?.(this.version.major) || `/api/${this.basename}/v1`;
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
      root: this.root,
      packageJson: this.packageJson,
      config: this.config,
      lastUpdatedTime: statSync(resolve(this.root, "package.json")).mtimeMs
    };
  }
}
