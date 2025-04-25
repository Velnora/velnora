import type { PluginOption, ServerOptions } from "vite";

import type { ViteAdapterOptions as IViteAdapterOptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import type { AdapterRegistry } from "../adapter.registry";
import { BaseClass } from "../base-class";

@ClassExtensions()
export class ViteAdapterOptions extends BaseClass<AdapterRegistry> implements IViteAdapterOptions {
  @ClassGetterSetter()
  declare server: ServerOptions;

  @ClassGetterSetter([])
  declare plugins: PluginOption[];
}
