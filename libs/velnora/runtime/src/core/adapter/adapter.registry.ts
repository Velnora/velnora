import type { RegisteredModule, VelnoraAdapter } from "@velnora/types";
import { ClassExtensions, ClassRawValues, singleton } from "@velnora/utils";
import { Registry } from "@velnora/utils/node";

import { adapterLogger } from "../../utils/logger/adapter-logger";
import { AdapterContext } from "./adapter.context";

@ClassRawValues()
@ClassExtensions()
export class AdapterRegistry extends Registry<VelnoraAdapter, AdapterContext> {
  constructor() {
    super("adapter", AdapterContext, adapterLogger);
  }

  use(name: string, module: RegisteredModule) {
    const resolvedName = this.resolveName(name);
    const adapter = this.registered.get(resolvedName);
    if (!adapter) throw new Error(`Adapter "${resolvedName}" is not registered.`);
    const context = super.use(name, module);
    Object.assign(context, adapter);
    context.checks();
    return context;
  }
}

export const adapterRegistry = singleton(AdapterRegistry);
