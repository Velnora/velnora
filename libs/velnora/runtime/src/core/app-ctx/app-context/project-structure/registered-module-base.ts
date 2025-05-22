import { AppType, type RegisteredModuleBase as IRegisteredModule } from "@velnora/types";
import { ClassGetterSetter } from "@velnora/utils";

import { BaseClass } from "../../base-class";

export abstract class RegisteredModuleBase extends BaseClass implements IRegisteredModule {
  declare type: AppType;

  @ClassGetterSetter()
  declare name: string;

  @ClassGetterSetter()
  declare root: string;

  declare config: {};

  abstract getEntryPoint(): string | string[] | Record<string, string | undefined> | undefined;
}
