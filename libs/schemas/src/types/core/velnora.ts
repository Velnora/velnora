import type { AppContext } from "../context";
import type { Logger } from "../logger";
import type { AppModuleGraph } from "../module-graph";
import type { ViteContainer, ViteServer } from "../vite";
import type { BackendRegistry } from "./backend-registry";
import type { HttpAdapter } from "./http-adapter";
import type { IntegrationContainer } from "./integration-container";
import type { Router } from "./router";
import type { RuntimeRegistry } from "./runtime-registry";

export interface Velnora {
  readonly logger: Logger;
  readonly graph: AppModuleGraph;
  readonly runtimes: RuntimeRegistry;
  readonly backends: BackendRegistry;
  readonly vite: ViteContainer;
  readonly http: HttpAdapter;
  readonly viteServer: ViteServer;
  readonly appContext: AppContext;
  readonly router: Router;
  readonly integrationContainer: IntegrationContainer;

  injectModules(): Promise<void>;
  listen(): Promise<void>;
  printUrls(deltaTime?: number): void;
  close(): void;
}
