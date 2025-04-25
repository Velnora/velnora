import { PluginOption } from "vite";

import type { FluxoraFramework } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ContainerBaseClass } from "./container-base-class";
import { FrameworkRegistry } from "./framework.registry";

@ClassExtensions()
export class FrameworkContext extends ContainerBaseClass<FrameworkRegistry> implements FluxoraFramework {
  @ClassGetterSetter([])
  declare plugins: PluginOption[];
}
