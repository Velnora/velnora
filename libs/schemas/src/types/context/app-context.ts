import type { BackendRoute, Integration, Package, ServerSetupContext, VelnoraContext } from "@velnora/schemas";

export interface AppContext {
  /**
   * Returns (or creates) the server setup context for a backend HTTP route.
   * Idempotent: calling twice with the same entry returns the same instance.
   */
  getOrCreateBackendHttpRouteContext(entry: BackendRoute): ServerSetupContext;

  /**
   * Returns (or creates) the VelNora integration context for a given app + integration.
   * Contexts are cached per (Package, Integration) pair.
   */
  getOrCreateVelnoraContext(entry: Package, integration: Integration): VelnoraContext;

  /**
   * Manually override or set the context for a given (Package, Integration).
   */
  setContext(entry: Package, integration: Integration, context: VelnoraContext): void;
}
