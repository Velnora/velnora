import type { VelnoraEnvironment } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { RegisteredApp } from "../app-ctx";
import { BaseClass } from "./base-class";

@ClassRawValues()
@ClassExtensions()
export class EnvironmentContext extends BaseClass implements VelnoraEnvironment {
  @ClassGetterSetter()
  declare isValidEnvironment: VelnoraEnvironment["isValidEnvironment"];

  @ClassGetterSetter()
  declare createServer: VelnoraEnvironment["createServer"];

  checkEnvironment(app: RegisteredApp) {
    if (!this.isValidEnvironment(app.config.environment)) {
      throw new Error(
        `Invalid environment ${app.config.environment} for ${app.name}. Please be sure "${app.config.environment}" is a valid environment for ${app.name}`
      );
    }
  }
}
