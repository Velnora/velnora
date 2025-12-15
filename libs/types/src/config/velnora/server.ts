import type { WatchOptions } from "vite";

export interface Server {
  host?: string;
  port?: number;
  watch?: WatchOptions;
}
