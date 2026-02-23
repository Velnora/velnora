import { describe, expectTypeOf, it } from "vitest";

import type { ResolvedToolchain } from "./resolved-toolchain";

describe("ResolvedToolchain interface (type-level)", () => {
  it("has a required string `binary` property", () => {
    expectTypeOf<ResolvedToolchain["binary"]>().toEqualTypeOf<string>();
  });

  it("has a required string `version` property", () => {
    expectTypeOf<ResolvedToolchain["version"]>().toEqualTypeOf<string>();
  });

  it("is not assignable from an empty object (both properties required)", () => {
    expectTypeOf<{}>().not.toExtend<ResolvedToolchain>();
  });

  it("is assignable from a valid object literal", () => {
    expectTypeOf<{ binary: string; version: string }>().toExtend<ResolvedToolchain>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ResolvedToolchain>().toEqualTypeOf<"binary" | "version">();
  });
});
