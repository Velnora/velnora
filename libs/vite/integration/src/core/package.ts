import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

import { glob } from "glob";
import type { PackageJson } from "type-fest";
import type { EnvironmentOptions } from "vite";

import { PackageKind, type Package as VelnoraPackage } from "@velnora/schemas";

import { fixIdForEnvironment } from "../utils/fix-id-for-environment";
import type { AppConfigManager } from "./velnora-server/app-config-manager";

export class Package implements VelnoraPackage {
  readonly id: string;
  readonly name: string;

  constructor(
    readonly root: string,
    readonly packageJson: PackageJson,
    readonly appConfigManager: AppConfigManager
  ) {
    this.id = packageJson.name || basename(root);
    this.name = basename(root);
  }

  // ToDo: Test and refine kind detection logic
  get kind() {
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

  async getConfig() {
    return await this.appConfigManager.getFor(this);
  }

  get environmentOptions() {
    const environments: Record<string, EnvironmentOptions> = {};
    const id = fixIdForEnvironment(this.id);

    if (this.kind === PackageKind.App || this.kind === PackageKind.Module) {
      environments[`${id}_client`] = {
        build: {
          lib: { entry: "", formats: ["es"] },
          ssr: false
        },
        consumer: "client"
      };
    }

    if (this.kind === PackageKind.App || this.kind === PackageKind.Service) {
      environments[`${id}_server`] = {
        build: {
          lib: { entry: "", formats: ["es"] },
          ssr: true
        },
        consumer: "server"
      };
    }

    if (this.kind === PackageKind.Lib) {
      environments[`${id}_lib`] = {
        build: {
          lib: { entry: "", formats: ["es"] },
          ssr: true
        },
        consumer: "server"
      };
    }

    return environments;
  }
}
