import { describe, expectTypeOf, it } from "vitest";

import type { BaseUnitContext } from "./base-unit-context";

// ---------------------------------------------------------------------------
// UnitContext<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("UnitContext<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  it("is an object type", () => {
    expectTypeOf<BaseUnitContext>().toBeObject();
  });

  it("has an `expose` method", () => {
    expectTypeOf<BaseUnitContext["expose"]>().toBeFunction();
  });

  it("has a `query` method", () => {
    expectTypeOf<BaseUnitContext["query"]>().toBeFunction();
  });

  it("has exactly `expose` and `query` keys", () => {
    expectTypeOf<keyof BaseUnitContext>().toEqualTypeOf<"expose" | "query">();
  });
});
