import type { ServerSetupContext } from "../backend";
import type { VelnoraContext } from "../context";
import type { Integration } from "../integration";
import type { Package } from "../package";
import type { BackendRoute } from "../router";

export interface ContextManager {
  forIntegration(entry: Package, integration: Integration): VelnoraContext;
  forRoute(route: BackendRoute): ServerSetupContext;
}
