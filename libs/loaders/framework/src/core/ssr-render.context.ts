import { RegisteredApp, RegisteredTemplate } from "@velnora/runtime";
import type { SSRRenderContext as ISSRRenderContext, TypedRoute } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "./base-class";

@ClassRawValues()
@ClassExtensions()
export class SSRRenderContext extends BaseClass<void> implements ISSRRenderContext {
  @ClassGetterSetter()
  declare app: RegisteredApp;

  @ClassGetterSetter()
  declare template: RegisteredTemplate;

  @ClassGetterSetter()
  declare route: TypedRoute;
}
