import type { LiteralUnion, PackageJson } from "type-fest";
import type { ViteDevServer } from "vite";
import type * as vite from "vite";

import type { Http, VelnoraConfig, ViteServer } from "@velnora/types";

import { devRunner } from "../../utils";
import { debug } from "../../utils/debug";
import type { ViteContainer } from "../vite-container";

export class ViteDev implements ViteServer {
  private readonly debug = debug.extend("vite-server");

  declare private viteInstance: typeof vite;
  declare private viteDevServer: ViteDevServer;

  constructor(
    private readonly container: ViteContainer,
    private readonly config: VelnoraConfig,
    private readonly server: Http
  ) {}

  get devServer() {
    return this.viteDevServer;
  }

  environment(envName: LiteralUnion<"client" | "ssr", string>) {
    return this.viteDevServer.environments[envName]!;
  }

  runnableDevEnv(env: string) {
    const devEnv = this.environment(env);
    if (!this.viteInstance.isRunnableDevEnvironment(devEnv)) {
      throw new Error("Vite dev environment 'ssr' is not runnable");
    }
    return devEnv;
  }

  async init() {
    if (this.viteInstance) return;

    this.debug("init-vite starting Vite dev server initialization");

    const vitePkgName = this.config.experiments?.rolldown ? "rolldown-vite" : "vite";
    const vitePkgJson = await devRunner.import<PackageJson>(`${vitePkgName}/package.json`);
    this.debug("init-vite using Vite package: %O", { name: vitePkgName, version: vitePkgJson.version });

    this.viteInstance = await devRunner.import<typeof vite>(vitePkgName);
    this.debug("init-vite Vite runtime imported");

    const options = this.container.build();
    this.debug("init-vite creating Vite dev server with options: %O", options);

    this.viteDevServer = await this.viteInstance.createServer(options);
    this.debug("init-vite Vite dev server created (middleware mode)");

    this.server.use(this.viteDevServer.middlewares);
    this.debug("init-vite attached Vite middlewares to Express app");

    this.server.on("close", () => {
      this.debug("init-vite received HttpAdapter close event, closing Vite dev server");
      return this.viteDevServer.close();
    });
    this.debug("init-vite attached Vite close handler to Node server");
  }

  transformIndexHtml(path: string, html = "") {
    return this.viteDevServer.transformIndexHtml(path, html);
  }
}
