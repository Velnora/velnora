import { describe, expectTypeOf, it } from "vitest";

import type { ToolchainFeatures } from "./toolchain-features";

describe("ToolchainFeatures interface (type-level)", () => {
  it("has an optional boolean `hotReload` property", () => {
    expectTypeOf<ToolchainFeatures["hotReload"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `incrementalBuild` property", () => {
    expectTypeOf<ToolchainFeatures["incrementalBuild"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `nativeImage` property", () => {
    expectTypeOf<ToolchainFeatures["nativeImage"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `workspaces` property", () => {
    expectTypeOf<ToolchainFeatures["workspaces"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `lockfile` property", () => {
    expectTypeOf<ToolchainFeatures["lockfile"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `audit` property", () => {
    expectTypeOf<ToolchainFeatures["audit"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `privateRegistry` property", () => {
    expectTypeOf<ToolchainFeatures["privateRegistry"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<ToolchainFeatures>();
  });
});
