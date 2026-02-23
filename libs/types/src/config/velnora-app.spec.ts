import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraAppConfig } from "./velnora-app";

describe("VelnoraAppConfig interface (type-level)", () => {
  it("should be assignable from an empty object", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().toExtend<VelnoraAppConfig>();
  });

  it("should be an object type", () => {
    expectTypeOf<VelnoraAppConfig>().toBeObject();
  });
});
