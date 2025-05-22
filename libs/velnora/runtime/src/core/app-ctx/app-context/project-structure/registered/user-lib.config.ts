import type { UserLibConfig as IUserLibConfig } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../../../base-class";

@ClassRawValues()
@ClassExtensions()
export class UserLibConfig extends BaseClass implements IUserLibConfig {
  @ClassGetterSetter("src/main")
  declare entry: string;
}
