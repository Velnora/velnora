import { type ViteDevServer, isRunnableDevEnvironment } from "vite";

import { VITE_ENVIRONMENTS } from "../../../const";
import { BaseClassContext } from "../base-class.context";

export class ViteContext extends BaseClassContext {
  private _videDevServer: ViteDevServer | undefined;

  get server() {
    if (!this._videDevServer) throw new Error("Vite dev server is not initialized");
    return this._videDevServer;
  }

  set server(server: ViteDevServer) {
    this._videDevServer = server;
  }

  getEnv(env: string) {
    const environment = this.server.environments[env];
    if (!environment) throw new Error(`Environment ${env} not found`);
    if (!isRunnableDevEnvironment(environment)) throw new Error(`Environment ${env} is not runnable`);
    return environment;
  }

  loadModule<TModule = any>(moduleId: string, env = VITE_ENVIRONMENTS.SERVER) {
    return this.getEnv(env).runner.import<TModule>(moduleId);
  }

  async loadModuleSilent<TModule = any>(moduleId: string, env = VITE_ENVIRONMENTS.SERVER) {
    try {
      return await this.loadModule<TModule>(moduleId, env);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
