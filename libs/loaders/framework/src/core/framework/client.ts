import type { Client as ICLient } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class Client extends BaseClass<FrameworkContext> implements ICLient {
  @ClassGetterSetter()
  declare mount: ICLient["mount"];

  @ClassGetterSetter()
  declare hydrate: ICLient["hydrate"];
}
