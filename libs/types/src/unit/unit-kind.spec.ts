import { describe, expectTypeOf, it } from "vitest";

import type { UnitKind } from "./unit-kind";

// ---------------------------------------------------------------------------
// UnitKind
// ---------------------------------------------------------------------------
describe("UnitKind enum (type-level)", () => {
  it("has a RUNTIME member assignable to 'runtime'", () => {
    expectTypeOf<UnitKind.RUNTIME>().toExtend<"runtime">();
  });

  it("has an ADAPTER member assignable to 'adapter'", () => {
    expectTypeOf<UnitKind.ADAPTER>().toExtend<"adapter">();
  });

  it("has an INTEGRATION member assignable to 'integration'", () => {
    expectTypeOf<UnitKind.INTEGRATION>().toExtend<"integration">();
  });

  it("members are assignable to string", () => {
    expectTypeOf<UnitKind.RUNTIME>().toExtend<string>();
    expectTypeOf<UnitKind.ADAPTER>().toExtend<string>();
    expectTypeOf<UnitKind.INTEGRATION>().toExtend<string>();
  });

  it("string is NOT assignable to UnitKind (narrowing check)", () => {
    expectTypeOf<string>().not.toExtend<UnitKind>();
  });

  it("is a union of exactly three members", () => {
    expectTypeOf<UnitKind>().toEqualTypeOf<UnitKind.RUNTIME | UnitKind.ADAPTER | UnitKind.INTEGRATION>();
  });
});
