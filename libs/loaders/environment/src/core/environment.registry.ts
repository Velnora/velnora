import type { RegisteredModule, VelnoraEnvironment } from "@velnora/types";
import { ClassExtensions, ClassRawValues, singleton } from "@velnora/utils";
import { Registry } from "@velnora/utils/node";

import { logger } from "../utils/logger";
import { EnvironmentContext } from "./environment.context";

@ClassRawValues()
@ClassExtensions()
export class EnvironmentRegistry extends Registry<VelnoraEnvironment, EnvironmentContext> {
  constructor() {
    super("environment", EnvironmentContext, logger);
  }

  use(name: string, module: RegisteredModule) {
    const resolvedName = this.resolveName(name);
    const environment = this.registered.get(resolvedName);
    if (!environment) throw new Error(`Environment "${resolvedName}" is not registered.`);
    const context = super.use(name, module);
    Object.assign(context, environment);
    return context;
  }
}

export const environmentRegistry = singleton("__ENVIRONMENT_REGISTRY__", () => new EnvironmentRegistry());
