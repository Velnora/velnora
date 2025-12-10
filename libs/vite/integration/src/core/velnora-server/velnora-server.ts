import { networkInterfaces } from "node:os";

import { Router } from "@velnora/router";
import {
  type ServerSetupFn,
  type Velnora,
  type VelnoraConfig,
  type WithDefault,
  defaultVelnoraConfig
} from "@velnora/schemas";

import { debug } from "../../utils/debug";
import { AppContext } from "../context/app-context";
import { type Logger, createLogger } from "../logger";
import { AppModuleGraph } from "./app-module-graph";
import { BackendRegistry } from "./backend-registry";
import { HttpAdapter } from "./http-adapter";
import { IntegrationContainer } from "./integration-container";
import { RuntimeRegistry } from "./runtime-registry";
import { ViteContainer } from "./vite-container";
import { ViteServer } from "./vite-server";

export class VelnoraServer implements Velnora {
  private readonly debug = debug.extend("velnora-server");

  declare private readonly _logger: Logger;
  declare private readonly _graph: AppModuleGraph;
  declare private readonly _runtimes: RuntimeRegistry;
  declare private readonly _backends: BackendRegistry;
  declare private readonly _vite: ViteContainer;
  declare private readonly _http: HttpAdapter;
  declare private readonly _viteServer: ViteServer;
  declare private readonly _appContext: AppContext;
  declare private readonly _router: Router;
  declare private readonly _integrationContainer: IntegrationContainer;

  declare private readonly _logging: Logger;

  declare private readonly _currentRuntime: string;

  constructor(config: VelnoraConfig = defaultVelnoraConfig) {
    this._logger = createLogger();
    this._graph = new AppModuleGraph(config);
    this._runtimes = new RuntimeRegistry();
    this._backends = new BackendRegistry();

    this._http = HttpAdapter.create(config);
    this._appContext = new AppContext(this);
    this._router = Router.create(this, this.logger.extend({ logger: "velnora:router" }));
    this._vite = new ViteContainer(config, this._router, {
      server: { watch: config.server?.watch ? config.server.watch : undefined }
    });
    this._viteServer = new ViteServer(this._vite, config, this._http);
    this._integrationContainer = new IntegrationContainer(config, this._appContext);

    this._logging = this._logger.extend({ logger: "velnora:dev-server" });

    this._currentRuntime = this._runtimes.detectRuntime();
  }

  get logger() {
    return this._logger;
  }

  get graph() {
    return this._graph;
  }

  get runtimes() {
    return this._runtimes;
  }

  get backends() {
    return this._backends;
  }

  get http() {
    return this._http;
  }

  get appContext() {
    return this._appContext;
  }

  get router() {
    return this._router;
  }

  get vite() {
    return this._vite;
  }

  get viteServer() {
    return this._viteServer;
  }

  get integrationContainer() {
    return this._integrationContainer;
  }

  static create(config: VelnoraConfig): Velnora {
    return new VelnoraServer(config);
  }

  async injectModules() {
    await this._viteServer.init();
    this.router.inject();
  }

  async listen() {
    await this.http.listen();
  }

  printUrls(deltaTime?: number) {
    const logger = this._logging.extend({ scope: "print-urls" });

    this.debug("print-urls called with deltaTime: %O", deltaTime);

    if (!this.http.isRunning) {
      this.debug("print-urls server is not running, skipping URL printout");
      return;
    }

    const address = this.http.address();
    this.debug("print-urls resolved server address: %O", address);

    const deltaTimeLabel = typeof deltaTime === "number" ? ` +${Math.round(deltaTime)}ms` : "";

    logger.log(`Velnora Dev Server running at:${deltaTimeLabel}`);

    // `server.address()` can be string, AddressInfo or null
    if (typeof address === "string") {
      // e.g. unix socket / pipe
      logger.log(`  > ${address}`);
      return;
    }

    if (!address) {
      logger.warn("print-urls got null address from http server");
      return;
    }

    const { address: host, port } = address;

    if (host === "::") {
      // Localhost + all external IPv4s
      logger.log(`  > http://localhost:${port}/`);

      const nets = networkInterfaces();
      for (const net of Object.values(nets)) {
        if (!net) continue;

        for (const iface of net) {
          if (!iface) continue;
          if (iface.family !== "IPv4" || iface.internal) continue;

          logger.log(`  > http://${iface.address}:${port}/`);
        }
      }
    } else {
      // Bound to a specific host
      logger.log(`  > http://${host}:${port}/`);
    }
  }

  close() {
    this.http.close();
  }
}
