import { AppType, type RegisteredApp as IRegisteredApp } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, SERVER_ENTRY_FILE_EXTENSIONS, findFile } from "@velnora/utils/node";

import { UserAppConfig } from "./registered";
import { RegisteredModuleBase } from "./registered-module-base";

@ClassRawValues()
@ClassExtensions()
export class RegisteredApp extends RegisteredModuleBase implements IRegisteredApp {
  @ClassGetterSetter(AppType.APPLICATION)
  declare type: AppType.APPLICATION;

  @ClassGetterSetter()
  declare config: UserAppConfig;

  getEntryPoint() {
    return {
      client: findFile(this.root, this.config.entry.client, CLIENT_ENTRY_FILE_EXTENSIONS),
      server: findFile(this.root, this.config.entry.server, SERVER_ENTRY_FILE_EXTENSIONS)
    };
  }
}
