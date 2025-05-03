import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { Adapter, UserConfig } from "@fluxora/types";
import { BaseClass, ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";
import { CONFIG_FILENAMES, resolveConfig } from "@fluxora/utils/node";

import { discoverApps } from "../modules/discover-apps";
import { discoverLibs } from "../modules/discover-libs";
import { discoverTemplates } from "../modules/discover-templates";
import { loadModules } from "../modules/load-modules";
import { BuildSettings, CacheSettings, CreateServerOptions, ProjectStructureContext, ViteContext } from "./app-context";

@ClassRawValues()
@ClassExtensions()
export class AppContext extends BaseClass<UserConfig> implements UserConfig {
  private isResolved = false;

  @ClassGetterSetter()
  declare projectStructure: ProjectStructureContext;

  @ClassGetterSetter()
  declare build: BuildSettings;

  @ClassGetterSetter()
  declare cache: CacheSettings;

  @ClassGetterSetter()
  declare server: CreateServerOptions;

  @ClassGetterSetter()
  declare adapter: Adapter;

  @ClassGetterSetter()
  declare vite: ViteContext;

  async resolveConfig() {
    if (this.isResolved) return;
    this.isResolved = true;

    const configFile = CONFIG_FILENAMES.map(file => resolve(process.cwd(), file)).find(file => existsSync(file));
    if (!configFile) return;
    const config = await resolveConfig<UserConfig>(configFile);
    if (!config) return;
    Object.assign(this, config);
  }

  async discoverModules() {
    return Promise.all([
      await discoverApps().then(loadModules),
      await discoverLibs().then(loadModules),
      await discoverTemplates().then(loadModules)
    ]);
  }
}
