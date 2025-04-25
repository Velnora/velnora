import type { SSROptions as ISSROptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ContainerBaseClass } from "../container-base-class";
import type { FrameworkContext } from "../framework.context";

@ClassExtensions()
export class SSROptions extends ContainerBaseClass<FrameworkContext> implements ISSROptions {
  @ClassGetterSetter()
  declare render: ISSROptions["render"];
}
