import type { Router } from "@velnora/router";
import type { Http, Injector, Logger, ModuleGraph, VelnoraConfig } from "@velnora/types";
import type { IntegrationContainer, ViteDev } from "@velnora/vite-integration";

import { debug } from "../utils/debug";

export class Velnora {
  private readonly debug = debug.extend("velnora");

  private constructor(
    private readonly _config: VelnoraConfig,
    private readonly _graph: ModuleGraph,
    private readonly _router: Router,
    private readonly _container: IntegrationContainer,
    private readonly _viteServer: ViteDev,
    private readonly _http: Http,
    private readonly _injector: Injector,
    private readonly _logger: Logger
  ) {}

  get http() {
    return this._http;
  }

  get middlewares() {
    return this._http.getMiddlewares();
  }

  static construct(
    config: VelnoraConfig,
    graph: ModuleGraph,
    router: Router,
    container: IntegrationContainer,
    viteServer: ViteDev,
    http: Http,
    injector: Injector,
    logger: Logger,
    deltaTime: number
  ) {
    const debugFn = debug.extend("velnora");
    debugFn("constructed-velnora in %dms", deltaTime);
    logger.log(`🚀 Velnora Dev Server ready in ${Math.round(deltaTime)}ms`);
    return new Velnora(config, graph, router, container, viteServer, http, injector, logger);
  }

  async listen() {
    this._injector.inject();
    await this.http.listen();
  }

  printUrls() {
    this.http.printUrls();
  }

  close() {
    this.http.close();
  }
}
