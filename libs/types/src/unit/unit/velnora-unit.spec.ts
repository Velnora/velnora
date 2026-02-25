import { describe, expectTypeOf, it } from "vitest";

import type { Toolchain } from "../runtime";
import type { BaseUnit } from "./base-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";
import type { VelnoraUnit } from "./velnora-unit";

// ---------------------------------------------------------------------------
// VelnoraUnit
// ---------------------------------------------------------------------------
describe("VelnoraUnit type alias (type-level)", () => {
  it("RuntimeUnit is assignable to VelnoraUnit", () => {
    expectTypeOf<RuntimeUnit>().toExtend<VelnoraUnit>();
  });

  it("VelnoraUnit is assignable to RuntimeUnit (currently equivalent)", () => {
    expectTypeOf<VelnoraUnit>().toExtend<RuntimeUnit>();
  });

  it("VelnoraUnit equals RuntimeUnit at this point in time", () => {
    expectTypeOf<VelnoraUnit>().toEqualTypeOf<RuntimeUnit>();
  });

  it("has `kind` discriminant of UnitKind.RUNTIME", () => {
    expectTypeOf<VelnoraUnit["kind"]>().toEqualTypeOf<UnitKind.RUNTIME>();
  });

  it("inherits BaseUnit metadata via RuntimeUnit", () => {
    expectTypeOf<VelnoraUnit>().toExtend<BaseUnit<readonly string[], readonly string[]>>();
  });

  it("inherits Toolchain lifecycle via RuntimeUnit", () => {
    expectTypeOf<VelnoraUnit>().toExtend<Toolchain>();
  });
});
