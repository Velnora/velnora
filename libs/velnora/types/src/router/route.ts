import type { RegisteredApp } from "../modules";

export interface Route {
  path: string;
  component(): Promise<unknown>;
}

export interface InternalRoute extends Route {
  app: RegisteredApp;
}

export interface TypedRoute extends InternalRoute {
  component<TComponent>(): Promise<TComponent>;
}

export interface RouteWithExact extends Route {
  exact: boolean;
}
