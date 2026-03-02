import { describe, expectTypeOf, it } from "vitest";

import type { BaseUnit } from "./base-unit";
import type { IntegrationUnit } from "./integration-unit";
import type { UnitKind } from "./unit-kind";

// ---------------------------------------------------------------------------
// IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
// ---------------------------------------------------------------------------
describe("IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to UnitKind.INTEGRATION", () => {
      expectTypeOf<IntegrationUnit["kind"]>().toEqualTypeOf<UnitKind.INTEGRATION>();
    });

    it("has `kind` assignable to the literal 'integration'", () => {
      expectTypeOf<IntegrationUnit["kind"]>().toExtend<"integration">();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to string[] (via LiteralUnion)", () => {
      type Req = IntegrationUnit["required"];
      expectTypeOf<Req>().toExtend<string[] | undefined>();
    });

    it("defaults TOptionalUnits to string[] (via LiteralUnion)", () => {
      type Opt = IntegrationUnit["optional"];
      expectTypeOf<Opt>().toExtend<string[] | undefined>();
    });

    it("defaults TCapabilities to (keyof Velnora.UnitRegistry)[]", () => {
      type Cap = IntegrationUnit["capabilities"];
      expectTypeOf<Cap>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
    });

    it("can be instantiated with zero type arguments (all have defaults)", () => {
      expectTypeOf<IntegrationUnit>().toBeObject();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toExtend<BaseUnit>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["capabilities"]>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
    });

    it("inherits optional `units` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toHaveProperty("units");
    });

    it("inherits optional `configure` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toHaveProperty("configure");
    });
  });

  describe("lifecycle hooks", () => {
    it("has an optional `configure` method", () => {
      type ConfigureFn = NonNullable<IntegrationUnit["configure"]>;
      expectTypeOf<ConfigureFn>().toBeFunction();
    });

    it("has an optional `build` method", () => {
      type BuildFn = NonNullable<IntegrationUnit["build"]>;
      expectTypeOf<BuildFn>().toBeFunction();
    });

    it("`configure` return type includes void", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<void>().toExtend<ConfigureReturn>();
    });

    it("`configure` return type includes Promise<void>", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<Promise<void>>().toExtend<ConfigureReturn>();
    });

    it("`build` return type includes void", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<void>().toExtend<BuildReturn>();
    });

    it("`build` return type includes Promise<void>", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<Promise<void>>().toExtend<BuildReturn>();
    });
  });

  describe("has exactly the expected keys", () => {
    it("includes kind, name, version, required, optional, capabilities, units, configure, build", () => {
      expectTypeOf<keyof IntegrationUnit>().toEqualTypeOf<
        "kind" | "name" | "version" | "required" | "optional" | "capabilities" | "units" | "configure" | "build"
      >();
    });
  });
});
