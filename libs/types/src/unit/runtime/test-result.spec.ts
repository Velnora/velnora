import { describe, expectTypeOf, it } from "vitest";

import type { TestResult } from "./test-result";
import type { TestSuiteResult } from "./test-result-suite";

describe("TestResult interface (type-level)", () => {
  it("has a required boolean `success` property", () => {
    expectTypeOf<TestResult["success"]>().toEqualTypeOf<boolean>();
  });

  it("has a required number `total` property", () => {
    expectTypeOf<TestResult["total"]>().toEqualTypeOf<number>();
  });

  it("has a required number `passed` property", () => {
    expectTypeOf<TestResult["passed"]>().toEqualTypeOf<number>();
  });

  it("has a required number `failed` property", () => {
    expectTypeOf<TestResult["failed"]>().toEqualTypeOf<number>();
  });

  it("has an optional number `skipped` property", () => {
    expectTypeOf<TestResult["skipped"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional number `duration` property", () => {
    expectTypeOf<TestResult["duration"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional `suites` property typed as TestSuiteResult[]", () => {
    expectTypeOf<TestResult["suites"]>().toEqualTypeOf<TestSuiteResult[] | undefined>();
  });

  it("is assignable from an object with only the required properties", () => {
    expectTypeOf<{
      success: boolean;
      total: number;
      passed: number;
      failed: number;
    }>().toExtend<TestResult>();
  });

  it("is not assignable from an empty object (required properties missing)", () => {
    expectTypeOf<{}>().not.toExtend<TestResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof TestResult>().toEqualTypeOf<
      "success" | "total" | "passed" | "failed" | "skipped" | "duration" | "suites"
    >();
  });
});
