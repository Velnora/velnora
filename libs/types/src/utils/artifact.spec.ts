import { describe, expectTypeOf, it } from "vitest";

import type { Artifact } from "./artifact";

describe("Artifact interface (type-level)", () => {
  it("should have path as string", () => {
    expectTypeOf<Artifact["path"]>().toEqualTypeOf<string>();
  });

  it("should have type as string", () => {
    expectTypeOf<Artifact["type"]>().toEqualTypeOf<string>();
  });

  it("should have size as optional number", () => {
    expectTypeOf<Artifact["size"]>().toEqualTypeOf<number | undefined>();
  });

  it("should be assignable from an object without size", () => {
    expectTypeOf<{ path: "dist/out.jar"; type: "jar" }>().toExtend<Artifact>();
  });

  it("should be assignable from a full object with size", () => {
    expectTypeOf<{ path: "dist/out.jar"; type: "jar"; size: 1024 }>().toExtend<Artifact>();
  });

  it("should have exact keys 'path' | 'type' | 'size'", () => {
    expectTypeOf<keyof Artifact>().toEqualTypeOf<"path" | "type" | "size">();
  });
});
