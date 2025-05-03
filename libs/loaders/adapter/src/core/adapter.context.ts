import type { VelnoraAdapter } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { AdapterServer, NestJsAdapterOptions, ViteAdapterOptions } from "./adapter";
import type { AdapterRegistry } from "./adapter.registry";
import { BaseClass } from "./base-class";

@ClassRawValues()
@ClassExtensions()
export class AdapterContext extends BaseClass<AdapterRegistry> implements VelnoraAdapter {
  @ClassGetterSetter()
  declare name: string;

  @ClassGetterSetter()
  declare nestjs: NestJsAdapterOptions;

  @ClassGetterSetter()
  declare vite: ViteAdapterOptions;

  @ClassGetterSetter()
  declare server: AdapterServer;
}
