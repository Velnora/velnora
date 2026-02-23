import { describe, expectTypeOf, it } from "vitest";

import type { ConfigEnv } from "./config-env";

describe("ConfigEnv interface (type-level)", () => {
  it("should have command as 'build' | 'serve'", () => {
    expectTypeOf<ConfigEnv["command"]>().toEqualTypeOf<"build" | "serve">();
  });

  it("should have mode as string", () => {
    expectTypeOf<ConfigEnv["mode"]>().toEqualTypeOf<string>();
  });

  it("should accept 'build' as a valid command", () => {
    expectTypeOf<"build">().toExtend<ConfigEnv["command"]>();
  });

  it("should accept 'serve' as a valid command", () => {
    expectTypeOf<"serve">().toExtend<ConfigEnv["command"]>();
  });

  it("should not accept 'watch' as a valid command", () => {
    expectTypeOf<"watch">().not.toExtend<ConfigEnv["command"]>();
  });

  it("should be assignable from { command: 'build', mode: 'production' }", () => {
    expectTypeOf<{ command: "build"; mode: "production" }>().toExtend<ConfigEnv>();
  });

  it("should have exact keys 'command' | 'mode'", () => {
    expectTypeOf<keyof ConfigEnv>().toEqualTypeOf<"command" | "mode">();
  });
});
