import type { SSROptions as ISSROptions } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class SSROptions extends BaseClass<FrameworkContext> implements ISSROptions {
  @ClassGetterSetter()
  declare render: ISSROptions["render"];
}
