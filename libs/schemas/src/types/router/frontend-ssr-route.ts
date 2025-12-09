import type { FrontendRoute } from "./frontend-route";
import type { SsrTarget } from "./ssr-target";

export interface FrontendSSrRoute extends Omit<FrontendRoute, "renderMode" | "indexHtmlFile"> {
  renderMode: "ssr";
  ssr: SsrTarget;
}
