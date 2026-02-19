import { describe, expectTypeOf, it } from "vitest";

import type { Artifact } from "./artifact";
import type { ConfigEnv } from "./config-env";

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
