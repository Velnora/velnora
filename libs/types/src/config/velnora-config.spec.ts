import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraConfig } from "./velnora-config";

describe("VelnoraConfig interface (type-level)", () => {
  it("should be assignable from an empty object", () => {
    expectTypeOf<{}>().toExtend<VelnoraConfig>();
  });

  it("should be an object type", () => {
    expectTypeOf<VelnoraConfig>().toBeObject();
  });
});
