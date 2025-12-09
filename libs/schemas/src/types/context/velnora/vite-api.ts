import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions } from "vite";

import type { VirtualOptions } from "./virtual-options";

export interface ViteApi {
  readonly virtualPrefix: string;
  readonly virtualAppConfig: string;

  define(importPath: string, actualPath: string): void;

  virtual(id: string, code?: string, options?: VirtualOptions): string;

  entryClient(code?: string, options?: VirtualOptions): string;
  entrySsr(code?: string, options?: VirtualOptions): string;
  entryServer(code?: string, options?: VirtualOptions): string;

  addEnvironment(side: LiteralUnion<"client" | "server" | "ssr", string>, environment?: EnvironmentOptions): string;
}
