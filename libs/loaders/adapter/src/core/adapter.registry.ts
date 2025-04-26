import type { FluxoraAdapter, RegisteredModule } from "@fluxora/types";
import { ClassExtensions, ClassRawValues, singleton } from "@fluxora/utils";
import { Registry } from "@fluxora/utils/node";

import { logger } from "../utils/logger";
import { AdapterContext } from "./adapter.context";

@ClassRawValues()
@ClassExtensions()
export class AdapterRegistry extends Registry<FluxoraAdapter, AdapterContext> {
  constructor() {
    super("adapter", AdapterContext, logger);
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

export const adapterRegistry = singleton("__ADAPTER_REGISTRY__", () => new AdapterRegistry());
