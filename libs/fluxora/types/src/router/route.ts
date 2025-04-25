export interface Route {
  path: string;
  component(): Promise<unknown>;
}

export interface InternalRoute extends Route {
  component<TComponent>(): Promise<TComponent>;
}

export interface RouteWithExact extends Route {
  exact: boolean;
}
