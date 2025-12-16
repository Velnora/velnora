import type { Package } from "@velnora/types";

import type { PathObject, PublicRouter } from "../types";
import type { Router as VelnoraRouter } from "../types/router";

export class Router implements VelnoraRouter {
  private listeners = new Set<(path: PathObject, previous?: PathObject | null) => void>();
  private readonly history: PathObject[] = [];
  private index = 0;

  protected constructor(private readonly app: Package) {
    if (typeof window !== "undefined") {
      const state = window.history.state as { __index?: number } | null;
      if (typeof state?.__index === "number") {
        this.index = state.__index;
      } else {
        this.index = 0;
        window.history.replaceState({ ...state, __index: this.index }, "", window.location.href);
      }

      const abortController = new AbortController();
      window.addEventListener("popstate", event => this.onPopState(event), { signal: abortController.signal });

      if (import.meta.hot) {
        import.meta.hot.dispose(() => {
          abortController.abort();
        });
      }
    }
  }

  get path() {
    return window.location.pathname.replace(new RegExp(`^${this.app.clientUrl}`), "") || "/";
  }

  get pathObject() {
    return this.getPathObject(this.path);
  }

  static create(app: Package) {
    return new Router(app);
  }

  push(path: string) {
    if (typeof window === "undefined") return;
    const currentState = window.history.state as { __index?: number } | null;

    const url = `${this.app.clientUrl}${path}`.replace(/\/\/+/g, "/");
    window.history.pushState({ ...currentState, __index: this.index }, "", url);
    this.notify();
    this.index++;
    this.history.push(this.getPathObject(path));
  }

  replace(path: string) {
    if (typeof window === "undefined") return;
    const currentState = window.history.state as { __index?: number } | null;

    const url = `${this.app.clientUrl}${path}`.replace(/\/\/+/g, "/");
    window.history.replaceState({ ...currentState, __index: this.index }, "", url);
    this.history.pop();
    this.notify();
    this.history.push(this.getPathObject(path));
  }

  subscribe(listener: (path: PathObject, previousPath?: PathObject | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getPath(path: string) {
    return `${this.app.clientUrl}${path}`.replace(/\/\/+/g, "/");
  }

  getPublicInterface(): PublicRouter {
    return {
      get path() {
        return this.path;
      },
      getPath: this.getPath.bind(this),
      push: this.push.bind(this),
      replace: this.replace.bind(this)
    };
  }

  private onPopState(event: PopStateEvent) {
    const state = event.state as { __index?: number } | null;

    this.index = state && typeof state.__index === "number" ? state.__index : this.index;
    this.notify();
  }

  private notify() {
    const previousPathIndex = this.index - 1;
    const previousPath = this.history.length > 0 ? this.history[previousPathIndex] : null;
    this.listeners.forEach(listener => listener(this.getPathObject(this.path), previousPath));
  }

  private getPathObject(path: string): PathObject {
    return { path: path.replace(new RegExp(`^${this.app.clientUrl}`), "") };
  }
}
