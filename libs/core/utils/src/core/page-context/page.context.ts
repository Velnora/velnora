import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import type { UserConfig } from "@fluxora/types";

import { resolveConfigFile } from "../../utils/resolve-config-file";
import { CacheContext } from "./page-context/cache.context";
import { ProjectStructure } from "./page-context/project-structure";
import { ViteContext } from "./page-context/vite.context";

declare global {
  var __PAGE_CONTEXT__: PageContext;
}

export class PageContext {
  private _vite?: ViteContext;
  private _projectStructure?: ProjectStructure;
  private _cache?: CacheContext;

  get vite() {
    if (!this._vite) this._vite = new ViteContext(this);
    return this._vite;
  }

  get projectStructure() {
    if (!this._projectStructure) this._projectStructure = new ProjectStructure(this);
    return this._projectStructure;
  }

  get cache() {
    if (!this._cache) this._cache = new CacheContext(this);
    return this._cache;
  }

  private _userConfig: UserConfig | undefined;

  get userConfig() {
    return this._userConfig!;
  }

  static instance() {
    if (!globalThis.__PAGE_CONTEXT__) {
      globalThis.__PAGE_CONTEXT__ = new PageContext();
    }
    return globalThis.__PAGE_CONTEXT__;
  }

  async init() {
    const appsDir = resolve(this.projectStructure.apps.dir);
    const apps = await readdir(appsDir);
    apps.forEach(app => (this.projectStructure.apps.app = app));
    this.projectStructure.apps.activeApp = this.projectStructure.apps.hostAppName;
  }

  async resolveUserConfig() {
    if (this._userConfig) return this._userConfig;

    const configFileName = ["fluxora.config.js", "fluxora.config.ts"].find(configFileName =>
      existsSync(resolve(process.cwd(), configFileName))
    );

    if (!configFileName) return (this._userConfig = {});
    const configFilePath = resolve(process.cwd(), configFileName);
    return (this._userConfig = (await resolveConfigFile<UserConfig>(configFilePath)) || {});
  }

  checks() {
    this.vite.checks();
    this.projectStructure.checks();
    this.cache.checks();
  }
}
