import { existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  AppType,
  type ProjectStructure as IProjectStructure,
  type RegisteredApp,
  type RegisteredLib,
  type RegisteredModuleBase,
  type RegisteredTemplate
} from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";
import { CONFIG_FILENAMES, resolveConfig } from "@velnora/utils/node";

import type { RegisteredModule } from "../../../types/registered-module";
import { BaseClass } from "../base-class";
import { ApplicationSettings, LibrarySettings, TemplateSettings } from "./project-structure";

@ClassRawValues()
@ClassExtensions()
export class ProjectStructureContext extends BaseClass implements IProjectStructure {
  @ClassGetterSetter()
  declare apps: ApplicationSettings;

  @ClassGetterSetter()
  declare libs: LibrarySettings;

  @ClassGetterSetter()
  declare template: TemplateSettings;

  @ClassGetterSetter()
  declare modules: Map<string, RegisteredModule>;

  register(module: RegisteredModuleBase) {
    const registrar = this.registrars[module.type] || this.registrars.DEFAULT;
    const registeredModule = registrar(module);
    this.modules.set(registeredModule.name, registeredModule);
  }

  private get registrars(): Record<AppType | "DEFAULT", (module: RegisteredModuleBase) => RegisteredModule> {
    const self = this;
    return {
      [AppType.APPLICATION](module) {
        return self.apps.register(module as RegisteredApp);
      },
      [AppType.LIBRARY](module) {
        return self.libs.register(module as RegisteredLib);
      },
      [AppType.TEMPLATE](module) {
        return self.template.register(module as RegisteredTemplate);
      },
      [AppType.FRAMEWORK]() {
        throw new Error("Frameworks can't be registered.");
      },
      DEFAULT(module) {
        throw new Error(`Unknown type: ${module.type}`);
      }
    };
  }

  async loadModule(module: RegisteredModuleBase) {
    const configFile = CONFIG_FILENAMES.map(file => resolve(module.root, file)).find(file => existsSync(file));
    const config = configFile ? (await resolveConfig(configFile)) || {} : {};
    this.register({ ...module, config });
  }

  *[Symbol.iterator]() {
    yield* this.modules.values();
  }
}
