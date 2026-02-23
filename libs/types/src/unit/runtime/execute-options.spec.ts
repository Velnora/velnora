import { describe, expectTypeOf, it } from "vitest";

import type { ExecuteOptions } from "./execute-options";

describe("ExecuteOptions interface (type-level)", () => {
  it("has an optional `args` property typed as string[]", () => {
    expectTypeOf<ExecuteOptions["args"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("has an optional `env` property typed as Record<string, string>", () => {
    expectTypeOf<ExecuteOptions["env"]>().toEqualTypeOf<Record<string, string> | undefined>();
  });

  it("has an optional `port` property typed as number", () => {
    expectTypeOf<ExecuteOptions["port"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional `watch` property typed as boolean", () => {
    expectTypeOf<ExecuteOptions["watch"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<ExecuteOptions>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ExecuteOptions>().toEqualTypeOf<"args" | "env" | "port" | "watch">();
  });
});
