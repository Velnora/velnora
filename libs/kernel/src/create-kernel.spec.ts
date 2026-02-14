/**
 * Unit tests for the {@link createKernel} factory function.
 *
 * Verifies that the factory returns a fresh {@link Kernel} instance on every
 * call, ensuring no shared state leaks between consumers.
 */
import { describe, expect, it } from "vitest";

import { Kernel } from "./kernel";
import { createKernel } from "./create-kernel";

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
