import { defineRoutes } from "fluxora/router";

export const routes = defineRoutes([{ path: "/", component: () => import("./entry-client") }]);
