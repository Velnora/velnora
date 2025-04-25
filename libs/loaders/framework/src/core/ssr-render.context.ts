import { RegisteredApp, RegisteredTemplate } from "@fluxora/runtime";
import type { SSRRenderContext as ISSRRenderContext, InternalRoute } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "./base-class";

@ClassRawValues()
@ClassExtensions()
export class SSRRenderContext extends BaseClass<void> implements ISSRRenderContext {
  @ClassGetterSetter()
  declare app: RegisteredApp;

  @ClassGetterSetter()
  declare template: RegisteredTemplate;

  @ClassGetterSetter()
  declare route: InternalRoute;
}
