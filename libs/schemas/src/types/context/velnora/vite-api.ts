import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions } from "vite";

export interface ViteApi {
  use<TModule>(
    factory: Promise<TModule> | (() => Promise<TModule>),
    ...options: TModule extends (...args: infer TArgs) => unknown
      ? TArgs
      : TModule extends { default: (...args: infer TArgs) => unknown }
        ? TArgs
        : never
  ): Promise<void>;
  define(importPath: string, actualPath: string): void;

  virtual(id: string, code?: string): string;
  addEnvironment(side: LiteralUnion<"client" | "server", string>, environment: EnvironmentOptions): void;
}
