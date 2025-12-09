import type { BackendRoute, FrontendRoute, FrontendSSrRoute } from "@velnora/schemas";

export interface RoutingTable {
  backend: BackendRoute[];
  csr: FrontendRoute[];
  ssr: FrontendSSrRoute[];
}
