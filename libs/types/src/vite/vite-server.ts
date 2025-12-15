import type { LiteralUnion } from "type-fest";
import type { RunnableDevEnvironment, ViteDevServer } from "vite";

export interface ViteServer {
  readonly devServer: ViteDevServer;

  /**
   * Get a Vite environment (client, ssr, or custom)
   */
  environment(envName: LiteralUnion<"client" | "ssr", string>): ViteDevServer["environments"][string];

  /**
   * Get an environment guaranteed to be runnable
   * (throws if not runnable)
   */
  runnableDevEnv(env: string): RunnableDevEnvironment;

  /**
   * Initialize Vite dev server.
   * Idempotent: double calls do nothing.
   */
  init(): Promise<void>;

  /**
   * Transform index.html at given path
   */
  transformIndexHtml(path: string, html?: string): Promise<string>;
}
