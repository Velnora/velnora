import type { ServerSetupFactory, ServerSetupFn } from "@velnora/schemas";

export const defineServerSetup =
  <TModule>(fn: ServerSetupFactory<TModule>): ServerSetupFn<TModule> =>
  module =>
  ctx =>
    fn(module, ctx);
