import { describe, expectTypeOf, it } from "vitest";

import type { AddOptions } from "./add-options";
import type { DependencyScope } from "./depdendency-scope";

describe("AddOptions interface (type-level)", () => {
  it("has an optional `scope` property typed as DependencyScope", () => {
    expectTypeOf<AddOptions["scope"]>().toEqualTypeOf<DependencyScope | undefined>();
  });

  it("has an optional `exact` property typed as boolean", () => {
    expectTypeOf<AddOptions["exact"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof AddOptions>().toEqualTypeOf<"scope" | "exact">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = { scope: DependencyScope; exact: boolean };
    expectTypeOf<Valid>().toExtend<AddOptions>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().toExtend<AddOptions>();
  });

  it("is assignable from a partial object", () => {
    expectTypeOf<{ scope: "dev" }>().toExtend<AddOptions>();
    expectTypeOf<{ exact: true }>().toExtend<AddOptions>();
  });
});
