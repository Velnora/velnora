import type { NestJsAdapterOptions as INestJsAdapterOptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";
import type { AbstractHttpAdapter } from "@nestjs/core";

import type { AdapterContext } from "../adapter.context";
import { BaseClass } from "../base-class";

function bindThisArg(this: NestJsAdapterOptions, value: any) {
  if (typeof value === "function") {
    return value.bind(this.parentClass.server);
  }
  return () => value;
}

@ClassExtensions()
export class NestJsAdapterOptions extends BaseClass<AdapterContext> implements INestJsAdapterOptions {
  @ClassGetterSetter(undefined, bindThisArg)
  declare adapter: () => AbstractHttpAdapter;
}
