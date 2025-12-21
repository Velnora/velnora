import { applications, applicationsMap } from "velnora:applications";
import bootstrap from "velnora:bootstrap";

import type { Node } from "@velnora/devkit";
import type { Package } from "@velnora/types";

import type { AppPathObject, ExternalPathObject, PathObject } from "../types";
import type { Router } from "./router";

const globalRouterKey = Symbol("velnora.router.global");
const g = globalThis as unknown as { [globalRouterKey]: GlobalRouter };

const apps = applications as Node[];
const appNames = new Set(apps.map(app => app.basename));

// ToDo: Implement app bootstrap mechanism properly
// console.log(bootstrap);

export class GlobalRouter {
  private readonly listeners = new Map<Package, Set<(path: PathObject) => void>>();

  private readonly appNameMap = new Map<string, Package>();
  private readonly routers = new Map<Package, Router>();

  private constructor() {
    if (typeof window !== "undefined") {
      const abortController = new AbortController();
      window.addEventListener(
        "popstate",
        () => {
          const pathObject = this.buildPathObjectFromLocation();
          if (!pathObject) return;
          this.notify(pathObject.app);
        },
        { signal: abortController.signal }
      );

      if (import.meta.hot) {
        import.meta.hot.dispose(() => {
          abortController.abort();
        });
      }
    }
  }

  static instance() {
    if (!g[globalRouterKey]) {
      g[globalRouterKey] = new GlobalRouter();
    }

    return g[globalRouterKey];
  }

  static register(app: Package, router: Router) {
    const instance = this.instance();
    instance.register(app, router);
  }

  getRouter(app: Package) {
    return this.routers.get(app);
  }

  navigate(app: Package, path: string) {
    if (typeof window === "undefined") return;
    const pathObject = this.getPathObject(path.replace(/\/+/g, "/"), app);
    if (pathObject.type === "external") {
      window.location.href = pathObject.url.href;
      return;
    }

    if (pathObject.app === app) {
      window.history.pushState({}, "", pathObject.href);
      this.notify(app);
      return;
    }

    window.location.href = pathObject.href;
  }

  replace(app: Package, path: string) {
    if (typeof window === "undefined") return;
    const pathObject = this.getPathObject(path.replace(/\/+/g, "/"), app);
    window.history.replaceState({}, "", pathObject.href);
    this.notify(app);
  }

  reload() {
    window.location.reload();
  }

  back(app: Package) {
    window.history.back();
    this.notify(app);
  }

  forward(app: Package) {
    window.history.forward();
    this.notify(app);
  }

  getPathObject(path: string, app?: Package) {
    const url = new URL(path, "http://localhost");

    if (appNames.has(url.protocol.slice(0, -1))) {
      const app = applicationsMap.get(url.protocol.slice(0, -1))!;
      if (!app) throw new Error(`Cannot build PathObject for path: ${path}`);
      return this.buildPathObjectForApp(app, url);
    } else if (url.origin !== "http://localhost") {
      return this.buildPathObjectForExternal(url);
    } else if (app) {
      return this.buildPathObjectForApp(app, url);
    }

    throw new Error(`Cannot build PathObject for path: ${path}`);
  }

  subscribe(app: Package, listener: (path: PathObject, previous?: PathObject | null) => void): () => void {
    if (!this.listeners.has(app)) this.listeners.set(app, new Set());

    const listeners = this.listeners.get(app)!;
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  private notify(app: Package) {
    const router = this.routers.get(app);
    if (!router) return;

    const listeners = this.listeners.get(app);
    if (!listeners) return;

    listeners.forEach(listener => listener(router.pathObject));
  }

  private buildPathObjectForApp(app: Package, url: URL): AppPathObject {
    return {
      type: "app",
      app,
      path: url.pathname,
      href: `${app.clientUrl}${url.pathname}`.replace(/\/+/g, "/").replace(/\/+$/g, "")
    };
  }

  private buildPathObjectForExternal(url: URL): ExternalPathObject {
    return { type: "external", url, path: url.pathname, href: `/${url.href}` };
  }

  private buildPathObjectFromLocation(): AppPathObject | null {
    if (typeof window === "undefined") return null;

    const app = apps.find(app => window.location.pathname.startsWith(app.clientUrl));
    if (!app) return null;

    const path = window.location.pathname.replace(new RegExp(`^${app.clientUrl}`), "") || "/";
    return this.buildPathObjectForApp(app, new URL(path, "http://localhost"));
  }

  private register(app: Package, router: Router) {
    this.appNameMap.set(app.name, app);
    this.appNameMap.set(app.basename, app);
    this.routers.set(app, router);
  }
}
