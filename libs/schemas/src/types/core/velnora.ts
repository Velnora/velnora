import type { AppModuleGraph } from "../module-graph";
import type { BackendRegistry } from "./backend-registry";
import type { HttpAdapter } from "./http-adapter";
import type { IntegrationContainer } from "./integration-container";
import type { Router } from "./router";
import type { RuntimeRegistry } from "./runtime-registry";

export interface Velnora {
  readonly integrationContainer: IntegrationContainer;
  readonly graph: AppModuleGraph;
  readonly backends: BackendRegistry;
  readonly runtimes: RuntimeRegistry;
  readonly router: Router;
  readonly http: HttpAdapter;

  listen(): Promise<void>;
  printUrls(deltaTime?: number): void;
  close(): void;
}
