import type { NestJsAdapterOptions as INestJsAdapterOptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";
import type { AbstractHttpAdapter } from "@nestjs/core";

import type { AdapterContext } from "../adapter.context";
import { BaseClass } from "../base-class";

function bindThisArg(this: NestJsAdapterOptions, value: any) {
  if (typeof value === "function") {
    return value.bind(this.parent.server);
  }
  return () => value;
}

@ClassRawValues()
@ClassExtensions()
export class NestJsAdapterOptions extends BaseClass<AdapterContext> implements INestJsAdapterOptions {
  @ClassGetterSetter(undefined, bindThisArg)
  declare adapter: () => AbstractHttpAdapter;
}
