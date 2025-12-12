import { randomUUID } from "node:crypto";

import type {
  BackendRoute,
  FrontendRoute,
  FrontendSsrRoute,
  Package,
  Routing as VelnoraRouting
} from "@velnora/schemas";

import type { Router } from "./router";

export class Routing implements VelnoraRouting {
  constructor(
    private readonly router: Router,
    private readonly pkg: Package
  ) {}

  registerFrontend(
    route: Omit<FrontendRoute, "id" | "app" | "side" | "path"> | Omit<FrontendSsrRoute, "id" | "app" | "side" | "path">
  ) {
    const prefix = this.pkg.clientUrl;
    this.router.register({ id: randomUUID(), side: "frontend", path: prefix, app: this.pkg, ...route });
    return this;
  }

  registerBackend(route: Omit<BackendRoute, "id" | "app" | "path" | "side">) {
    const prefix = this.pkg.serverUrl;
    this.router.register({ id: randomUUID(), side: "backend", path: prefix, app: this.pkg, ...route });
    return this;
  }
}
