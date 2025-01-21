import type { ProxyOptions } from "vite";

export interface CreateServerOptions {
  port?: number;
  proxy?: Record<string, ProxyOptions>;
}
