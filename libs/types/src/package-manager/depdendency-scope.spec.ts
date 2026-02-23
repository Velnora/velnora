import { describe, expectTypeOf, it } from "vitest";

import type { DependencyScope } from "./depdendency-scope";

describe("DependencyScope (type-level)", () => {
  it("accepts 'runtime'", () => {
    expectTypeOf<"runtime">().toExtend<DependencyScope>();
  });

  it("accepts 'dev'", () => {
    expectTypeOf<"dev">().toExtend<DependencyScope>();
  });

  it("accepts 'test'", () => {
    expectTypeOf<"test">().toExtend<DependencyScope>();
  });

  it("accepts 'provided'", () => {
    expectTypeOf<"provided">().toExtend<DependencyScope>();
  });

  it("is exactly the four-member union", () => {
    expectTypeOf<DependencyScope>().toEqualTypeOf<"runtime" | "dev" | "test" | "provided">();
  });

  it("does not accept arbitrary strings", () => {
    expectTypeOf<string>().not.toExtend<DependencyScope>();
  });
});
