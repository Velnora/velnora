interface Route {
  path: string;
  component: string;
  ssr?: boolean;
}

interface RegistryRoutes {
  add(route: Route): void;
}

interface RegistryServer {
  httpHandler(handlerId: string, fnRef: string): void; // registers a server render handler id→export ref
}

export interface RegistryApi {
  routes: RegistryRoutes;
  server: RegistryServer;
}
