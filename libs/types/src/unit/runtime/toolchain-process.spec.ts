import { describe, expectTypeOf, it } from "vitest";

import type { CompileResult } from "./compile-result";
import type { ToolchainProcess } from "./toolchain-process";

describe("ToolchainProcess<T> interface (type-level)", () => {
  it("has a `stdout` property typed as ReadableStream<string>", () => {
    expectTypeOf<ToolchainProcess<unknown>["stdout"]>().toEqualTypeOf<ReadableStream<string>>();
  });

  it("has a `stderr` property typed as ReadableStream<string>", () => {
    expectTypeOf<ToolchainProcess<unknown>["stderr"]>().toEqualTypeOf<ReadableStream<string>>();
  });

  it("has a `result` property typed as Promise<T>", () => {
    expectTypeOf<ToolchainProcess<string>["result"]>().toEqualTypeOf<Promise<string>>();
  });

  it("has a `kill` method returning Promise<void>", () => {
    expectTypeOf<ToolchainProcess<unknown>["kill"]>().toEqualTypeOf<() => Promise<void>>();
  });

  it("flows the generic parameter T through to `result`", () => {
    expectTypeOf<ToolchainProcess<CompileResult>["result"]>().toEqualTypeOf<Promise<CompileResult>>();
  });

  it("preserves generic type with number", () => {
    expectTypeOf<ToolchainProcess<number>["result"]>().toEqualTypeOf<Promise<number>>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ToolchainProcess<unknown>>().toEqualTypeOf<"stdout" | "stderr" | "result" | "kill">();
  });
});
