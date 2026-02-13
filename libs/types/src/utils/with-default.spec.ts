import { describe, expectTypeOf, it } from "vitest";

import type { WithDefault } from "./with-default";

describe("WithDefault<T> utility type (type-level)", () => {
  it("should accept the bare value", () => {
    expectTypeOf<{ foo: string }>().toExtend<WithDefault<{ foo: string }>>();
  });

  it("should accept a wrapper with a default key", () => {
    expectTypeOf<{ default: { foo: string } }>().toExtend<WithDefault<{ foo: string }>>();
  });

  it("should be a union of T and { default: T }", () => {
    type Expected = string | { default: string };
    expectTypeOf<WithDefault<string>>().toEqualTypeOf<Expected>();
  });

  it("should work with primitive types", () => {
    expectTypeOf<number>().toExtend<WithDefault<number>>();
    expectTypeOf<{ default: number }>().toExtend<WithDefault<number>>();
  });
});
