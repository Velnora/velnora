import type { RuntimeAdapter } from "./runtime-adapter";

export interface RuntimeRegistry {
  detectRuntime(): string;

  register(adapter: RuntimeAdapter): void;
  getSilent(id: string): RuntimeAdapter | undefined;
  get(id: string): RuntimeAdapter;
}
