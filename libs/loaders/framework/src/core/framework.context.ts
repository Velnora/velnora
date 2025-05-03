import { PluginOption } from "vite";

import type { VelnoraFramework } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "./base-class";
import { FrameworkRegistry } from "./framework.registry";

@ClassRawValues()
@ClassExtensions()
export class FrameworkContext extends BaseClass<FrameworkRegistry> implements VelnoraFramework {
  @ClassGetterSetter([])
  declare plugins: PluginOption[];
}
