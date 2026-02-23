import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraAppConfig } from "./velnora-app";
import type { VelnoraEnvironment } from "./velnora-environment";

describe("VelnoraEnvironment interface (type-level)", () => {
  it("should be an object type", () => {
    expectTypeOf<VelnoraEnvironment>().toBeObject();
  });

  it("should be assignable from an empty object", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().toExtend<VelnoraEnvironment>();
  });

  it("should be the value type of VelnoraAppConfig.environments", () => {
    type EnvValue = NonNullable<VelnoraAppConfig["environments"]>[string];
    expectTypeOf<EnvValue>().toEqualTypeOf<VelnoraEnvironment>();
  });
});
