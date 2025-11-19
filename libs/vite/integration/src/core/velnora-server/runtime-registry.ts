import type { RuntimeRegistry as VelnoraRuntimeRegistry } from "@velnora/schemas";
import type { RuntimeAdapter } from "@velnora/schemas";

export class RuntimeRegistry implements VelnoraRuntimeRegistry {
  private readonly adapters = new Map<string, RuntimeAdapter>();

  detectRuntime() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    if ((globalThis as any).Bun) {
      return "bun";
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    if ((globalThis as any).Deno) {
      return "deno";
    }

    return "node";
  }

  register(adapter: RuntimeAdapter) {
    const name = adapter.name;

    if (this.adapters.has(name)) {
      throw new Error(`Runtime adapter with name "${name}" is already registered.`);
    }

    this.adapters.set(adapter.name, adapter);
  }

  getSilent(id: string): RuntimeAdapter | undefined {
    return this.adapters.get(id);
  }

  get(id: string): RuntimeAdapter {
    const adapter = this.getSilent(id);
    if (!adapter) {
      throw new Error(`Runtime adapter with name "${id}" is not registered.`);
    }
    return adapter;
  }
}
