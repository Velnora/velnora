import type { NestJsAdapterOptions as INestJsAdapterOptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";
import type { AbstractHttpAdapter } from "@nestjs/core";

import { bindThisArg } from "../../utils/bind-this-arg-to-server";
import type { AdapterContext } from "../adapter.context";
import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class NestJsAdapterOptions extends BaseClass<AdapterContext> implements INestJsAdapterOptions {
  @ClassGetterSetter(undefined, bindThisArg)
  declare adapter: () => AbstractHttpAdapter;
}
