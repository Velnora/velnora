import type { RegisteredApp } from "@fluxora/runtime";
import type { FluxoraEnvironment } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { BaseClass } from "./base-class";

@ClassExtensions()
export class EnvironmentContext extends BaseClass implements FluxoraEnvironment {
  @ClassGetterSetter()
  declare isValidEnvironment: FluxoraEnvironment["isValidEnvironment"];

  @ClassGetterSetter()
  declare createServer: FluxoraEnvironment["createServer"];

  checkEnvironment(app: RegisteredApp) {
    if (!this.isValidEnvironment(app.config.environment)) {
      throw new Error(
        `Invalid environment ${app.config.environment} for ${app.name}. Please be sure "${app.config.environment}" is a valid environment for ${app.name}`
      );
    }
  }
}
