import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

import { glob } from "glob";
import { parse } from "semver";
import type { Jsonify, PackageJson } from "type-fest";

import {
  PackageKind,
  type VelnoraAppConfig,
  type VelnoraConfig,
  type Package as VelnoraPackage
} from "@velnora/schemas";

import type { AppConfigManager } from "./velnora-server/app-config-manager";

export class Package implements VelnoraPackage {
  readonly id: string;
  readonly name: string;

  declare private _config: VelnoraAppConfig;

  constructor(
    readonly root: string,
    readonly packageJson: PackageJson,
    readonly appConfigManager: AppConfigManager,
    private readonly rootConfig: VelnoraConfig
  ) {
    this.id = packageJson.name || basename(root);
    this.name = basename(root);
  }

  get config() {
    return this._config;
  }

  get version(): VelnoraPackage["version"] {
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

  get clientUrl() {
    return this.config.client?.url || (this.isHostApplication ? "/" : `/${this.name}`);
  }

  get serverUrl() {
    const routePath = this.config.server?.url;
    return typeof routePath === "string" ? routePath : routePath?.(this.version.major) || `/api/${this.name}/v1`;
  }

  // ToDo: Test and refine kind detection logic
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
    this._config = await this.appConfigManager.getFor(this);
    return this._config;
  }

  get isHostApplication() {
    return this.name === this.rootConfig.hostApp;
  }

  toJSON(): Jsonify<Omit<VelnoraPackage, "packageJson">> & { packageJson: PackageJson } {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      kind: this.kind,
      clientUrl: this.clientUrl,
      serverUrl: this.serverUrl,
      root: this.root,
      packageJson: this.packageJson,
      config: this.config,
      isHostApplication: this.isHostApplication
    };
  }
}
