import { describe, expectTypeOf, it } from "vitest";

import type { CompileResult } from "./compile-result";

describe("CompileResult interface (type-level)", () => {
  it("has a boolean `success` property", () => {
    expectTypeOf<CompileResult["success"]>().toEqualTypeOf<boolean>();
  });

  it("has a string `outputDir` property", () => {
    expectTypeOf<CompileResult["outputDir"]>().toEqualTypeOf<string>();
  });

  it("has an optional `errors` property typed as string[]", () => {
    expectTypeOf<CompileResult["errors"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("is assignable from an object without `errors`", () => {
    expectTypeOf<{ success: boolean; outputDir: string }>().toExtend<CompileResult>();
  });

  it("is assignable from an object with `errors`", () => {
    expectTypeOf<{ success: boolean; outputDir: string; errors: string[] }>().toExtend<CompileResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof CompileResult>().toEqualTypeOf<"success" | "outputDir" | "errors">();
  });
});
