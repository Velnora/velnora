import type { BackendRoute } from "./backend-route";
import type { FrontendRoute } from "./frontend-route";
import type { FrontendSSrRoute } from "./frontend-ssr-route";

export type Route = FrontendRoute | FrontendSSrRoute | BackendRoute;
