import type { Client as ICLient } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ContainerBaseClass } from "../container-base-class";
import type { FrameworkContext } from "../framework.context";

@ClassExtensions()
export class Client extends ContainerBaseClass<FrameworkContext> implements ICLient {
  @ClassGetterSetter()
  declare mount: ICLient["mount"];

  @ClassGetterSetter()
  declare hydrate: ICLient["hydrate"];
}
