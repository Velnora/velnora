import type { ProxyOptions } from "vite";

import { Velnora } from "../namespace";

export interface CreateServerOptions extends Velnora.CreateServerOptions {
  /**
   * The host to run the server on
   * @default "localhost"
   */
  host: string;

  /**
   * The port to run the server on
   * @default 3000
   */
  port: number;

  /**
   * The host to run the server on
   */
  proxy: Record<string, ProxyOptions>;
}
