import type { PluginOption, ServerOptions } from "vite";

import type { ViteAdapterOptions as IViteAdapterOptions } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import type { AdapterRegistry } from "../adapter.registry";
import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class ViteAdapterOptions extends BaseClass<AdapterRegistry> implements IViteAdapterOptions {
  @ClassGetterSetter()
  declare server: ServerOptions;

  @ClassGetterSetter([])
  declare plugins: PluginOption[];
}
