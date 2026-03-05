/**
 * Unit tests for the {@link createKernel} factory function.
 *
 * Verifies that the factory returns a fresh {@link Kernel} instance on every
 * call, ensuring no shared state leaks between consumers.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@velnora/utils", () => ({
  detectWorkspace: vi.fn(),
  detectProjects: vi.fn(),
  parseConfig: vi.fn(),
  GlobalRegistry: {
    use: vi.fn(() => ({
      has: vi.fn(() => false),
      get: vi.fn(),
      set: vi.fn(),
      getAll: vi.fn(() => [])
    }))
  },
  UNITS_REGISTRY: { warnings: ":units:warnings", aliases: ":units:aliases", store: ":units:store" },
  CONTEXT_REGISTRY: { base: ":context:base" },
  defineAdapter: vi.fn(),
  defineRuntime: vi.fn(),
  validateVersionRange: vi.fn(),
  makeRegistryObject: vi.fn()
}));

vi.mock("@velnora/host", () => ({
  Host: vi.fn()
}));

vi.mock("@velnora/adapter-h3", () => ({
  default: { kind: "adapter", name: "h3", configure: vi.fn() }
}));

vi.mock("@velnora/runtime-node", () => ({
  default: { kind: "runtime", name: "node", configure: vi.fn() }
}));

vi.mock("lodash.merge", () => ({
  default: vi.fn((...args: unknown[]) => Object.assign({}, ...args))
}));

import { createKernel } from "./create-kernel";
import { Kernel } from "./kernel";

describe("createKernel", () => {
  it("should return a Kernel instance", () => {
    const kernel = createKernel();

    expect(kernel).toBeInstanceOf(Kernel);
  });

  it("should return a new instance each call", () => {
    const a = createKernel();
    const b = createKernel();

    expect(a).not.toBe(b);
  });
});
