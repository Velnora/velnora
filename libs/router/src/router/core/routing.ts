import { randomUUID } from "node:crypto";

import type { BackendRoute, FrontendRoute, Package, Routing as VelnoraRouting } from "@velnora/schemas";

import type { Router } from "./router";

export class Routing implements VelnoraRouting {
  constructor(
    private readonly router: Router,
    private readonly pkg: Package
  ) {}

  registerFrontend(route: Omit<FrontendRoute, "id" | "app" | "path" | "side">) {
    const prefix = this.pkg.clientPath;
    this.router.register({ id: randomUUID(), side: "frontend", path: prefix, app: this.pkg, ...route });
    return this;
  }

  registerBackend(route: Omit<BackendRoute, "id" | "app" | "path" | "side">) {
    const prefix = this.pkg.serverPath;
    this.router.register({ id: randomUUID(), side: "backend", path: prefix, app: this.pkg, ...route });
    return this;
  }
}
