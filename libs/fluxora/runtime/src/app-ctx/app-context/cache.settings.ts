import type { CacheSettings as ICacheSettings } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class CacheSettings extends BaseClass implements ICacheSettings {
  @ClassGetterSetter(".fluxora")
  declare root: string;
}
