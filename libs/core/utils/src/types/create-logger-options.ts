import type { ServerConfig } from "./server-config";

export interface CreateLoggerOptions {
  name: string;
  servers?: ServerConfig[];
  transform?(...logs: any[]): any[];
}
