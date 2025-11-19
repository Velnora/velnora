import { networkInterfaces } from "node:os";

import { Router } from "@velnora/router";
import { type Velnora, type VelnoraConfig, defaultVelnoraConfig } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import { AppContext } from "../context/app-context";
import { AppModuleGraph } from "./app-module-graph";
import { BackendRegistry } from "./backend-registry";
import { HttpAdapter } from "./http-adapter";
import { IntegrationContainer } from "./integration-container";
import { RuntimeRegistry } from "./runtime-registry";
import { ViteContainer } from "./vite-container";
import { ViteServer } from "./vite-server";

export class VelnoraServer implements Velnora {
  private readonly debug = debug.extend("velnora-server");

  declare private readonly _graph: AppModuleGraph;
  declare private readonly _vite: ViteContainer;
  declare private readonly _appContext: AppContext;
  declare private readonly _integrationContainer: IntegrationContainer;
  declare private readonly _runtimes: RuntimeRegistry;
  declare private readonly _backends: BackendRegistry;
  declare private readonly _router: Router;
  declare private readonly _http: HttpAdapter;
  declare private readonly _viteServer: ViteServer;

  declare private readonly _currentRuntime: string;

  constructor(config: VelnoraConfig = defaultVelnoraConfig) {
    this._graph = new AppModuleGraph();
    this._vite = new ViteContainer({ server: { watch: config.server?.watch ? config.server.watch : undefined } });
    this._appContext = new AppContext(this._graph, this._vite);
    this._integrationContainer = new IntegrationContainer(config, this._appContext);
    this._router = Router.create();
    this._runtimes = new RuntimeRegistry();
    this._backends = new BackendRegistry();
    this._http = HttpAdapter.create(config);
    this._viteServer = new ViteServer(this._vite, config, this._http);

    this._currentRuntime = this._runtimes.detectRuntime();
  }

  get router() {
    return this._router;
  }

  get graph() {
    return this._graph;
  }

  get integrationContainer() {
    return this._integrationContainer;
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

  static async create(config: VelnoraConfig): Promise<Velnora> {
    const velnora = new VelnoraServer(config);
    await velnora.init();
    return velnora;
  }

  async init() {}

  async listen() {
    await this._viteServer.init();
    await this.http.listen();
  }

  printUrls(deltaTime?: number) {
    this.debug("print-urls called with deltaTime: %O", deltaTime);

    if (!this.http.isRunning) {
      this.debug("print-urls server is not running, skipping URL printout");
      return;
    }

    const address = this.http.address();
    this.debug("print-urls resolved server address: %O", address);

    const deltaTimeString = deltaTime ? `+${deltaTime.toFixed(0)}ms` : "";
    console.log(`  Velnora Dev Server running at: ${deltaTimeString}`);
    if (typeof address === "string") {
      console.log(`    > http://${address}/`);
    } else if (address !== null) {
      if (address.address === "::") {
        console.log(`    > http://localhost:${address.port}/`);
        Object.values(networkInterfaces())
          .flat()
          .filter(n => !!n)
          .filter(net => net.family === "IPv4" && !net.internal)
          .map(net => net.address)
          .forEach(host => console.log(`    > http://${host}:${address.port}/`));
      } else {
        console.log(`    > http://${address.address}:${address.port}/`);
      }
    }
  }

  close() {
    this.http.close();
  }
}
