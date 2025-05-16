import { defineRoutes } from "velnora/router";

export const routes = defineRoutes([{ path: "/", component: () => import("./app/page") }]);
