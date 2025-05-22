import type { BuildSettings as IBuildSettings } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class BuildSettings extends BaseClass implements IBuildSettings {
  @ClassGetterSetter()
  declare outDir: string;
}
