import { describe, expectTypeOf, it } from "vitest";

import type { ProcessHandle } from "./process-handle";

describe("ProcessHandle interface (type-level)", () => {
  it("has a required number `pid` property", () => {
    expectTypeOf<ProcessHandle["pid"]>().toEqualTypeOf<number>();
  });

  it("has an optional `port` property typed as number", () => {
    expectTypeOf<ProcessHandle["port"]>().toEqualTypeOf<number | undefined>();
  });

  it("is assignable from an object with only `pid`", () => {
    expectTypeOf<{ pid: number }>().toExtend<ProcessHandle>();
  });

  it("is not assignable from an empty object (pid is required)", () => {
    expectTypeOf<{}>().not.toExtend<ProcessHandle>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ProcessHandle>().toEqualTypeOf<"pid" | "port">();
  });
});
