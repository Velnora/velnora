import { type ViteDevServer, createServer } from "vite";

import type { CreateServerOptions } from "./create-server.types";

export class Server {
  private _viteServer: ViteDevServer = null!;

  constructor(private readonly options?: CreateServerOptions) {}

  get vite() {
    return this._viteServer;
  }

  async init() {
    this._viteServer = await createServer({
      ssr: this.options?.type === "server" ? {} : undefined,
      server: { port: this.options?.server?.port, host: true }
    });
  }

  async serve() {
    await this._viteServer.listen();
    this._viteServer.printUrls();
  }
}
