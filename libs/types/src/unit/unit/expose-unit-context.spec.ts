import { describe, expectTypeOf, it } from "vitest";

import type { ExposeUnitContext } from "./expose-unit-context";

// ---------------------------------------------------------------------------
// UnitContext<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("UnitContext<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  it("is an object type", () => {
    expectTypeOf<ExposeUnitContext>().toBeObject();
  });

  it("has an `expose` method", () => {
    expectTypeOf<ExposeUnitContext["expose"]>().toBeFunction();
  });

  it("has exactly `expose` and `query` keys", () => {
    expectTypeOf<keyof ExposeUnitContext>().toEqualTypeOf<"expose">();
  });
});
