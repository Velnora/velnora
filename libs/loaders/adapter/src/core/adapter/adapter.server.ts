import type { AdapterServer as IAdapterServer } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import type { AdapterContext } from "../adapter.context";
import { BaseClass } from "../base-class";

function call(value: any) {
  return typeof value === "function" ? value() : undefined;
}

function bindThisArg(this: AdapterServer, value: any) {
  return typeof value === "function" ? value.bind(this) : () => value;
}

@ClassRawValues()
@ClassExtensions()
export class AdapterServer extends BaseClass<AdapterContext> implements IAdapterServer {
  @ClassGetterSetter(undefined, call)
  declare instance: ReturnType<IAdapterServer["instance"]>;

  @ClassGetterSetter(undefined, bindThisArg)
  declare use: IAdapterServer["use"];

  @ClassGetterSetter(undefined, bindThisArg)
  declare get: IAdapterServer["get"];

  @ClassGetterSetter(undefined, bindThisArg)
  declare post: IAdapterServer["post"];

  @ClassGetterSetter(undefined, bindThisArg)
  declare put: IAdapterServer["put"];

  @ClassGetterSetter(undefined, bindThisArg)
  declare patch: IAdapterServer["patch"];

  @ClassGetterSetter(undefined, bindThisArg)
  declare delete: IAdapterServer["delete"];
}
