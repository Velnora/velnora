import { type ViteDevServer, isRunnableDevEnvironment } from "vite";

import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class ViteContext extends BaseClass {
  @ClassGetterSetter()
  declare servers: Map<string, ViteDevServer>;

  getSsr(name: string, initialServer?: ViteDevServer) {
    const server = initialServer || this.servers.get(name);
    if (!server) throw new Error("Vite server is not initialized");
    const ssrEnv = server.environments.ssr;
    if (!isRunnableDevEnvironment(ssrEnv)) throw new Error("SSR environment is not runnable");
    return ssrEnv;
  }

  setServer(name: string, server: ViteDevServer) {
    this.servers.set(name, server);
  }
}
