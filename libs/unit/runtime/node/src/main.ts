import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import type { PackageJson } from "type-fest";

import { defineRuntime, validateVersionRange } from "@velnora/utils";

import pkgJson from "../package.json";
import { NpmPackageManager } from "./package-managers/npm";

const require = createRequire(import.meta.url);

interface JavaScriptRuntime {
  run(file: string): Promise<void>;
}

declare global {
  namespace Velnora {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface NodeJS extends JavaScriptRuntime {}

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface JavaScript extends JavaScriptRuntime {}

    export interface UnitRegistry {
      javascript: JavaScript;
      node: NodeJS;
    }
  }
}

export default defineRuntime({
  name: "node",
  runtime: "node",
  version: pkgJson.version,

  capabilities: ["javascript", "node"],

  detect(cwd) {
    if (!existsSync(resolve(cwd, NpmPackageManager.prototype.manifestName))) return false;
    const pkgJson = require(resolve(cwd, NpmPackageManager.prototype.manifestName)) as PackageJson;
    return Boolean(!pkgJson.engines?.node || validateVersionRange(process.versions.node, pkgJson.engines.node));
  },

  resolve(ctx) {
    const pkgJson = require(resolve(ctx.cwd, NpmPackageManager.prototype.manifestName)) as PackageJson;
    const nodeExecutable = execSync('node -e "console.log(process.execPath);"', { encoding: "utf-8" });
    const nodeVersion = execSync('node -e "console.log(process.versions.node);"', { encoding: "utf-8" });

    return { binary: nodeExecutable, version: pkgJson.engines?.node || nodeVersion };
  },

  // compile() {},
  //
  // execute() {},
  //
  // test() {},
  //
  // package() {},

  resolvePackageManager(cwd: string) {
    if (!existsSync(resolve(cwd, NpmPackageManager.prototype.manifestName))) return;
    if (existsSync(resolve(cwd, NpmPackageManager.prototype.lockfileName))) return new NpmPackageManager();
  }
});
