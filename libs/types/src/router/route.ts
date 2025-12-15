import type { BackendRoute } from "./backend-route";
import type { FrontendRoute } from "./frontend-route";
import type { FrontendSsrRoute } from "./frontend-ssr-route";

export type Route = FrontendRoute | FrontendSsrRoute | BackendRoute;
