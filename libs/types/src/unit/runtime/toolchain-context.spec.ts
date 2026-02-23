import { describe, expectTypeOf, it } from "vitest";

import type { ToolchainContext } from "./toolchain-context";

describe("ToolchainContext interface (type-level)", () => {
  it("has a required string `cwd` property", () => {
    expectTypeOf<ToolchainContext["cwd"]>().toEqualTypeOf<string>();
  });

  it("is not assignable from an empty object (cwd is required)", () => {
    expectTypeOf<{}>().not.toExtend<ToolchainContext>();
  });

  it("is assignable from a valid object literal", () => {
    expectTypeOf<{ cwd: string }>().toExtend<ToolchainContext>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ToolchainContext>().toEqualTypeOf<"cwd">();
  });
});
