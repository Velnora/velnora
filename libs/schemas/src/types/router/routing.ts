import type { BackendRoute } from "./backend-route";
import type { FrontendRoute } from "./frontend-route";
import type { FrontendSSrRoute } from "./frontend-ssr-route";

export interface Routing {
  registerFrontend(
    route: Omit<FrontendRoute, "id" | "app" | "side" | "path"> | Omit<FrontendSSrRoute, "id" | "app" | "side" | "path">
  ): this;
  registerBackend(route: Omit<BackendRoute, "id" | "app" | "side" | "path">): this;
}
