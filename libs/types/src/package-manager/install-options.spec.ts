import { describe, expectTypeOf, it } from "vitest";

import type { InstallOptions } from "./install-options";

describe("InstallOptions interface (type-level)", () => {
  it("has an optional boolean `frozen` property", () => {
    expectTypeOf<InstallOptions["frozen"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `production` property", () => {
    expectTypeOf<InstallOptions["production"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof InstallOptions>().toEqualTypeOf<"frozen" | "production">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = { frozen: boolean; production: boolean };
    expectTypeOf<Valid>().toExtend<InstallOptions>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().toExtend<InstallOptions>();
  });

  it("is assignable from a partial object", () => {
    expectTypeOf<{ frozen: true }>().toExtend<InstallOptions>();
    expectTypeOf<{ production: false }>().toExtend<InstallOptions>();
  });
});
