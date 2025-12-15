import type { ServerSetupFactory, ServerSetupFn } from "@velnora/types";

export const defineServerSetup =
  <TModule>(fn: ServerSetupFactory<TModule>): ServerSetupFn<TModule> =>
  module =>
  ctx =>
    fn(module, ctx);
