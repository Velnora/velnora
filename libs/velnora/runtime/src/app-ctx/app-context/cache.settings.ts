import type { CacheSettings as ICacheSettings } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class CacheSettings extends BaseClass implements ICacheSettings {
  @ClassGetterSetter(".velnora/cache")
  declare root: string;
}
