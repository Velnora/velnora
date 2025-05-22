import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { Adapter, UserConfig } from "@velnora/types";
import { BaseClass, ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";
import { CONFIG_FILENAMES, resolveConfig } from "@velnora/utils/node";

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
      await this.projectStructure.apps.loadApps(),
      await this.projectStructure.libs.loadLibs(),
      await this.projectStructure.template.loadTemplate()
    ]);
  }
}
