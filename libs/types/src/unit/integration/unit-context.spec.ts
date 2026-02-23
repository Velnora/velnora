import { describe, expectTypeOf, it } from "vitest";

import type { UnitContext } from "./unit-context";

// ---------------------------------------------------------------------------
// UnitContext<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("UnitContext<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  it("is an object type", () => {
    expectTypeOf<UnitContext>().toBeObject();
  });

  it("has an `expose` method", () => {
    expectTypeOf<UnitContext["expose"]>().toBeFunction();
  });

  it("has a `query` method", () => {
    expectTypeOf<UnitContext["query"]>().toBeFunction();
  });

  it("has exactly `expose` and `query` keys", () => {
    expectTypeOf<keyof UnitContext>().toEqualTypeOf<"expose" | "query">();
  });
});
