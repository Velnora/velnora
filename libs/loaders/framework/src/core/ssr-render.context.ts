import { RegisteredApp, RegisteredTemplate } from "@fluxora/runtime";
import type { SSRRenderContext as ISSRRenderContext, InternalRoute } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ContainerBaseClass } from "./container-base-class";

@ClassExtensions()
export class SSRRenderContext extends ContainerBaseClass<void> implements ISSRRenderContext {
  @ClassGetterSetter()
  declare app: RegisteredApp;

  @ClassGetterSetter()
  declare template: RegisteredTemplate;

  @ClassGetterSetter()
  declare route: InternalRoute;
}
