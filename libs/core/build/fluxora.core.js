import { createServer as createServer$1 } from 'vite';

class Server {
  constructor(options) {
    this.options = options;
  }
  _viteServer = null;
  get vite() {
    return this._viteServer;
  }
  async init() {
    this._viteServer = await createServer$1({
      server: { port: this.options?.server?.port, host: true }
    });
  }
  async serve() {
    await this._viteServer.listen();
    this._viteServer.printUrls();
  }
}

const createServer = async (options) => {
  const server = new Server(options);
  await server.init();
  return server;
};

export { createServer };
//# sourceMappingURL=fluxora.core.js.map
