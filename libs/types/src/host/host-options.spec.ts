import { describe, expectTypeOf, it } from "vitest";

import type { HostOptions } from "./host-options";

describe("HostOptions interface (type-level)", () => {
  it("should have an optional number `port` field", () => {
    expectTypeOf<HostOptions["port"]>().toEqualTypeOf<number | undefined>();
  });

  it("should have an optional string `host` field", () => {
    expectTypeOf<HostOptions["host"]>().toEqualTypeOf<string | undefined>();
  });

  it("should be assignable from an empty object (all fields optional)", () => {
    expectTypeOf<{}>().toExtend<HostOptions>();
  });

  it("should accept a fully populated object", () => {
    expectTypeOf({ port: 3000, host: "localhost" }).toExtend<HostOptions>();
  });

  it("should only have known keys", () => {
    expectTypeOf<keyof HostOptions>().toEqualTypeOf<"port" | "host">();
  });
});
