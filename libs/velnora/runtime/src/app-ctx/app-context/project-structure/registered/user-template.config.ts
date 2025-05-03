import type { Framework, UserTemplateConfig as IUserTemplateConfig } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../../../base-class";

@ClassRawValues()
@ClassExtensions()
export class UserTemplateConfig extends BaseClass implements IUserTemplateConfig {
  @ClassGetterSetter("src/main")
  declare entry: string;

  @ClassGetterSetter("react")
  declare framework: Framework;
}
