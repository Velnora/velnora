import type { UserLibConfig as IUserLibConfig } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { BaseClass } from "../../../base-class";

@ClassExtensions()
export class UserLibConfig extends BaseClass implements IUserLibConfig {
  @ClassGetterSetter("src/main")
  declare entry: string;
}
