import { PluginOption } from "vite";

import type { FluxoraFramework } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "./base-class";
import { FrameworkRegistry } from "./framework.registry";

@ClassRawValues()
@ClassExtensions()
export class FrameworkContext extends BaseClass<FrameworkRegistry> implements FluxoraFramework {
  @ClassGetterSetter([])
  declare plugins: PluginOption[];
}
