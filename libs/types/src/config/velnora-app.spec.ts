import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraAppConfig } from "./velnora-app";

describe("VelnoraAppConfig interface (type-level)", () => {
  it("should be assignable from an empty object", () => {
    expectTypeOf<{}>().toExtend<VelnoraAppConfig>();
  });

  it("should be an object type", () => {
    expectTypeOf<VelnoraAppConfig>().toBeObject();
  });
});
