import type { Type } from "@nestjs/common";
import { Logger } from "@velnora/logger";
import type { RegisteredModule } from "@velnora/types";

import { BaseClass, ClassGetterSetter, capitalize } from "../client";
import { serverEnv } from "./utils";

export abstract class Registry<TRegistryItem, TContainerClass> extends BaseClass {
  @ClassGetterSetter()
  declare protected readonly registered: Map<string, TRegistryItem>;

  @ClassGetterSetter()
  declare protected readonly modulesMap: Map<string, TContainerClass>;

  @ClassGetterSetter()
  declare protected readonly moduleNameMap: Map<string, string>;

  private readonly moduleName: string = undefined!;
  private readonly ContainerClass: Type<TContainerClass> = undefined!;
  private readonly logger: Logger = undefined!;
  private readonly singleton: boolean = undefined!;

  protected constructor(
    moduleName: string,
    ContainerClass: Type<TContainerClass>,
    logger: Logger,
    singleton: boolean = false
  ) {
    super();
    Object.defineProperties(this, {
      moduleName: { value: moduleName, writable: false, enumerable: false, configurable: false },
      ContainerClass: { value: ContainerClass, writable: false, enumerable: false, configurable: false },
      logger: { value: logger, writable: false, enumerable: false, configurable: false },
      singleton: { value: singleton, writable: false, enumerable: false, configurable: false }
    });
  }

  async registerModule(name: string, module?: string) {
    if (this.moduleNameMap.has(name)) {
      throw new Error(`${capitalize(this.moduleName)} "${name}" is already registered.`);
    }
    const moduleName = module || `@velnora/${this.moduleName}-${name}`;
    this.moduleNameMap.set(name, moduleName);
    await serverEnv.runner.import(moduleName);
  }

  register(name: string, item: TRegistryItem) {
    if (this.registered.has(name)) {
      throw new Error(`${capitalize(this.moduleName)} "${name}" is already registered.`);
    }

    this.logger.info(`Registering ${this.moduleName} "${name}".`);
    this.registered.set(name, item);
  }

  isRegistered(name: string) {
    return this.registered.has(name) || this.moduleNameMap.has(name);
  }

  registerSilent(name: string, item: TRegistryItem): void;
  registerSilent(name: string, module?: string): Promise<void>;
  registerSilent(name: string, module?: TRegistryItem | string) {
    if (this.isRegistered(name)) return;
    if (typeof module === "object") {
      return this.register(name, module);
    } else {
      return this.registerModule(name, module as string | undefined);
    }
  }

  use(name: string, module: RegisteredModule) {
    const resolvedName = this.resolveName(name);
    const registerName = this.singleton ? resolvedName : `${resolvedName}@${module.name}`;

    if (this.modulesMap.has(registerName)) {
      return this.modulesMap.get(registerName)!;
    }

    const container = new this.ContainerClass(this, module);
    this.modulesMap.set(registerName, container);
    return container;
  }

  protected resolveName(name: string) {
    if (this.moduleNameMap.has(name)) {
      return this.moduleNameMap.get(name)!;
    }
    return name;
  }
}
