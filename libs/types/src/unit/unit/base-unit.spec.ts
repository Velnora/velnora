import type { Promisable } from "type-fest";
import { describe, expectTypeOf, it } from "vitest";

import type { BaseUnit } from "./base-unit";
import type { BaseUnitContext } from "./base-unit-context";
import type { ExposeUnitContext } from "./expose-unit-context";
import type { VelnoraUnit } from "./velnora-unit";

// ---------------------------------------------------------------------------
// BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
// ---------------------------------------------------------------------------
describe("BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities> interface (type-level)", () => {
  // Use a concrete instantiation for most checks (2 generic params, 3rd defaults)
  type ConcreteBase = BaseUnit<["node"], ["go", "jvm"]>;

  it("has a string `name` property", () => {
    expectTypeOf<ConcreteBase["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<ConcreteBase["version"]>().toEqualTypeOf<string>();
  });

  it("carries the exact required tuple type from its first generic parameter (optional)", () => {
    expectTypeOf<ConcreteBase["required"]>().toEqualTypeOf<["node"] | undefined>();
  });

  it("carries the exact optional tuple type from its second generic parameter (optional)", () => {
    expectTypeOf<ConcreteBase["optional"]>().toEqualTypeOf<["go", "jvm"] | undefined>();
  });

  it("has an optional `capabilities` property typed from its third generic parameter", () => {
    expectTypeOf<ConcreteBase["capabilities"]>().toEqualTypeOf<(keyof Velnora.UnitRegistry)[] | undefined>();
  });

  it("has an optional `units` property", () => {
    expectTypeOf<ConcreteBase>().toHaveProperty("units");
  });

  it("has an optional `configure` method", () => {
    expectTypeOf<ConcreteBase>().toHaveProperty("configure");
  });

  it("allows omitting optional properties", () => {
    type WithoutOptionals = {
      name: string;
      version: string;
    };

    expectTypeOf<WithoutOptionals>().toExtend<ConcreteBase>();
  });

  it("is generic -- different tuple parameters produce different types", () => {
    type A = BaseUnit<["node"], []>;
    type B = BaseUnit<["jvm", "kotlin"], ["node"]>;

    expectTypeOf<A["required"]>().toEqualTypeOf<["node"] | undefined>();
    expectTypeOf<B["required"]>().toEqualTypeOf<["jvm", "kotlin"] | undefined>();

    // The two instantiations are structurally distinct
    expectTypeOf<A["required"]>().not.toEqualTypeOf<B["required"]>();
  });

  it("accepts string[] as an unconstrained generic argument", () => {
    type Unconstrained = BaseUnit<string[], string[]>;

    expectTypeOf<Unconstrained["required"]>().toEqualTypeOf<string[] | undefined>();
    expectTypeOf<Unconstrained["optional"]>().toEqualTypeOf<string[] | undefined>();
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to string[] (via LiteralUnion)", () => {
      expectTypeOf<BaseUnit["required"]>().toExtend<string[] | undefined>();
    });

    it("defaults TOptionalUnits to string[] (via LiteralUnion)", () => {
      expectTypeOf<BaseUnit["optional"]>().toExtend<string[] | undefined>();
    });

    it("defaults TCapabilities to (keyof Velnora.UnitRegistry)[]", () => {
      expectTypeOf<BaseUnit["capabilities"]>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
    });

    it("can be instantiated with zero type arguments (all have defaults)", () => {
      expectTypeOf<BaseUnit>().toBeObject();
      expectTypeOf<BaseUnit["name"]>().toEqualTypeOf<string>();
      expectTypeOf<BaseUnit["version"]>().toEqualTypeOf<string>();
    });
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof BaseUnit>().toEqualTypeOf<
      "name" | "version" | "required" | "optional" | "capabilities" | "units" | "configure"
    >();
  });
});
