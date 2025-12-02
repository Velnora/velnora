import type { LiteralUnion, Promisable } from "type-fest";
import type { EnvironmentOptions, PluginOption } from "vite";

export interface ViteApi {
  use(...plugins: PluginOption[]): Promisable<void>;
  define(importPath: string, actualPath: string): void;

  virtual(id: string, code?: string): string;

  entryClient(code?: string): string;
  entryServer(code?: string): string;

  addEnvironment(side: LiteralUnion<"client" | "server", string>, environment: EnvironmentOptions): string;
}
