import type { FluxoraAdapter } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { AdapterServer, NestJsAdapterOptions, ViteAdapterOptions } from "./adapter";
import type { AdapterRegistry } from "./adapter.registry";
import { BaseClass } from "./base-class";

@ClassExtensions()
export class AdapterContext extends BaseClass<AdapterRegistry> implements Omit<FluxoraAdapter, "name" | "apply"> {
  @ClassGetterSetter()
  declare nestjs: NestJsAdapterOptions;

  @ClassGetterSetter()
  declare vite: ViteAdapterOptions;

  @ClassGetterSetter()
  declare server: AdapterServer;
}
