import type { RoutingBase } from "./routing-base";

export interface FrontendRoute extends RoutingBase {
  side: "frontend";
  indexHtmlFile?: string;
  renderMode: "csr";
}
