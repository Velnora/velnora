import type { LiteralUnion, PackageJson } from "type-fest";
import type { ViteDevServer } from "vite";
import type * as vite from "vite";

import type { HttpAdapter, VelnoraConfig } from "@velnora/schemas";
import type { ViteServer as VelnoraViteServer } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import { devRunner } from "../../utils/vite";
import type { ViteContainer } from "./vite-container";

export class ViteServer implements VelnoraViteServer {
  private readonly debug = debug.extend("vite-server");

  declare private viteInstance: typeof vite;
  declare private viteDevServer: ViteDevServer;

  constructor(
    private readonly vite: ViteContainer,
    private readonly config: VelnoraConfig,
    private readonly server: HttpAdapter
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

    const options = this.vite.build();
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
