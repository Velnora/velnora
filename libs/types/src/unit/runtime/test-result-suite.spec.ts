import { describe, expectTypeOf, it } from "vitest";

import type { TestSuiteResult } from "./test-result-suite";

describe("TestSuiteResult interface (type-level)", () => {
  it("has a required string `name` property", () => {
    expectTypeOf<TestSuiteResult["name"]>().toEqualTypeOf<string>();
  });

  it("has a `tests` property that is an array", () => {
    expectTypeOf<TestSuiteResult["tests"]>().toBeArray();
  });

  it("has test entries with a string `name`", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["name"]>().toEqualTypeOf<string>();
  });

  it("has test entries with a union `status` of passed, failed, or skipped", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["status"]>().toEqualTypeOf<"passed" | "failed" | "skipped">();
  });

  it("has test entries with an optional number `duration`", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["duration"]>().toEqualTypeOf<number | undefined>();
  });

  it("is not assignable from an empty object (name and tests are required)", () => {
    expectTypeOf<{}>().not.toExtend<TestSuiteResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof TestSuiteResult>().toEqualTypeOf<"name" | "tests">();
  });
});
