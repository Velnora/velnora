import type { BuildSettings as IBuildSettings } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class BuildSettings extends BaseClass implements IBuildSettings {
  @ClassGetterSetter()
  declare outDir: string;
}
