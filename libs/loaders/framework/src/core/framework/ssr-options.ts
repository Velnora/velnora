import type { SSROptions as ISSROptions } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class SSROptions extends BaseClass<FrameworkContext> implements ISSROptions {
  @ClassGetterSetter()
  declare render: ISSROptions["render"];
}
