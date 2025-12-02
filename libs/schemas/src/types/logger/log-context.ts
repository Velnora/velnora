import type { Package } from "../package";

export interface LogContext {
  // Recommended reserved fields
  app?: Package;
  logger?: string; // e.g. "velnora", "velnora:nest", "velnora:react"
  scope?: string; // "http", "hmr", "integration", "dev-server"
  runtime?: string; // "node", "bun", "deno", "jvm", ...
  side?: "frontend" | "backend" | "worker" | "cli";
  env?: string; // "development", "production", "test"
  requestId?: string; // HTTP / trace correlation
  sessionId?: string;
  userId?: string | number;
}
