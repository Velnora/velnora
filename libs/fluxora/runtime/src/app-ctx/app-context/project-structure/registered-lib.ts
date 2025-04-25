import { AppType, type RegisteredLib as IDiscoveredLib } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@fluxora/utils/node";

import { UserLibConfig } from "./registered";
import { RegisteredModuleBase } from "./registered-module-base";

@ClassRawValues()
@ClassExtensions()
export class RegisteredLib extends RegisteredModuleBase implements IDiscoveredLib {
  @ClassGetterSetter(AppType.LIBRARY)
  declare type: AppType.LIBRARY;

  @ClassGetterSetter()
  declare config: UserLibConfig;

  getEntryPoint() {
    return findFile(this.root, this.config.entry, CLIENT_ENTRY_FILE_EXTENSIONS);
  }
}
