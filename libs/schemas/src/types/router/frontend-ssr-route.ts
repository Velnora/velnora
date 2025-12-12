import type { FrontendRoute } from "./frontend-route";
import type { SsrTarget } from "./ssr-target";

export interface FrontendSsrRoute extends Omit<FrontendRoute, "renderMode"> {
  renderMode: "ssr";
  ssr: SsrTarget;
}
