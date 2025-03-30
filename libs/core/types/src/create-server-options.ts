import type { ProxyOptions } from "vite";

export interface CreateServerOptions {
  /**
   * The port to run the server on
   */
  port?: number;

  /**
   * The host to run the server on
   */
  proxy?: Record<string, ProxyOptions>;
}
