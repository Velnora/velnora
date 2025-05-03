import { AppType, type RegisteredTemplate as IRegisteredTemplate } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@velnora/utils/node";

import { UserTemplateConfig } from "./registered";
import { RegisteredModuleBase } from "./registered-module-base";

@ClassRawValues()
@ClassExtensions()
export class RegisteredTemplate extends RegisteredModuleBase implements IRegisteredTemplate {
  @ClassGetterSetter(AppType.TEMPLATE)
  declare type: AppType.TEMPLATE;

  @ClassGetterSetter()
  declare config: UserTemplateConfig;

  getEntryPoint() {
    return findFile(this.root, this.config.entry, CLIENT_ENTRY_FILE_EXTENSIONS);
  }
}
