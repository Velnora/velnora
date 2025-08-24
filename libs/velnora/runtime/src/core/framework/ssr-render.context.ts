import type { TypedRoute } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { RegisteredTemplate } from "../app-ctx";
import { Entity } from "../entity-manager";
import { BaseClass } from "./base-class";

@ClassRawValues()
@ClassExtensions()
export class SSRRenderContext extends BaseClass<void> {
  @ClassGetterSetter()
  declare entity: Entity;

  @ClassGetterSetter()
  declare template: RegisteredTemplate;

  @ClassGetterSetter()
  declare route: TypedRoute;
}
