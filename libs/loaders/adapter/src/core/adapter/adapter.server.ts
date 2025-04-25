import type { AdapterServer as IAdapterServer } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { bindThisArg } from "../../utils/bind-this-arg-to-server";
import { call } from "../../utils/call";
import type { AdapterContext } from "../adapter.context";
import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class AdapterServer extends BaseClass<AdapterContext> implements IAdapterServer {
  @ClassGetterSetter(undefined, call)
  declare instance: IAdapterServer["instance"];

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

  @ClassGetterSetter()
  declare handler: IAdapterServer["handler"];

  checks() {
    if (!this?.instance) throw new Error("Server instance is not set");

    // const descriptor = Object.getOwnPropertyDescriptor(this, "instance");
    // console.log(descriptor?.get?.());
    // if (descriptor?.get && descriptor.value) {
    //   throw new Error("Server instance is not set");
    // }
  }
}
