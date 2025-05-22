import type { TemplateOptions as ITemplateOptions } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class TemplateOptions extends BaseClass<FrameworkContext> implements ITemplateOptions {
  @ClassGetterSetter()
  declare render: ITemplateOptions["render"];
}
