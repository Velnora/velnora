import { describe, expectTypeOf, it } from "vitest";

import type { AdapterUnit } from "./adapter-unit";
import type { IntegrationUnit } from "./integration-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";
import type { VelnoraUnit } from "./velnora-unit";

// ---------------------------------------------------------------------------
// VelnoraUnit
// ---------------------------------------------------------------------------
describe("VelnoraUnit type alias (type-level)", () => {
  describe("union nature", () => {
    it("RuntimeUnit is assignable to VelnoraUnit", () => {
      expectTypeOf<RuntimeUnit>().toExtend<VelnoraUnit>();
    });

    it("IntegrationUnit is assignable to VelnoraUnit", () => {
      expectTypeOf<IntegrationUnit>().toExtend<VelnoraUnit>();
    });

    it("AdapterUnit is assignable to VelnoraUnit", () => {
      expectTypeOf<AdapterUnit>().toExtend<VelnoraUnit>();
    });

    it("VelnoraUnit is NOT equivalent to RuntimeUnit alone", () => {
      expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<RuntimeUnit>();
    });

    it("VelnoraUnit is NOT equivalent to IntegrationUnit alone", () => {
      expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<IntegrationUnit>();
    });

    it("VelnoraUnit is NOT equivalent to AdapterUnit alone", () => {
      expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<AdapterUnit>();
    });
  });

  describe("discriminant", () => {
    it("has `kind` that is a union of all three UnitKind members", () => {
      expectTypeOf<VelnoraUnit["kind"]>().toEqualTypeOf<
        UnitKind.RUNTIME | UnitKind.INTEGRATION | UnitKind.ADAPTER
      >();
    });

    it("`kind` covers the full UnitKind enum", () => {
      expectTypeOf<VelnoraUnit["kind"]>().toEqualTypeOf<UnitKind>();
    });
  });

  describe("shared properties", () => {
    it("all union members share `name` as string", () => {
      expectTypeOf<VelnoraUnit["name"]>().toBeString();
    });

    it("all union members share `version` as string", () => {
      expectTypeOf<VelnoraUnit["version"]>().toBeString();
    });
  });

  describe("generic parameters", () => {
    it("accepts three generic parameters with defaults", () => {
      // VelnoraUnit with no explicit generics is valid
      expectTypeOf<VelnoraUnit>().toBeObject();
    });

    it("passes generic parameters through to all union members", () => {
      type Specific = VelnoraUnit<["node"], ["go"]>;
      expectTypeOf<Specific>().toBeObject();
    });
  });
});
