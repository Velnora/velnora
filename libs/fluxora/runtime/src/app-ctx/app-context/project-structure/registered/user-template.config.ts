import type { Framework, UserTemplateConfig as IUserTemplateConfig } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { BaseClass } from "../../../base-class";

@ClassExtensions()
export class UserTemplateConfig extends BaseClass implements IUserTemplateConfig {
  @ClassGetterSetter("src/main")
  declare entry: string;

  @ClassGetterSetter("react")
  declare framework: Framework;
}
