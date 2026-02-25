import { describe, expectTypeOf, it } from "vitest";

import type { BaseUnit } from "./base-unit";

// ---------------------------------------------------------------------------
// BaseUnit<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("BaseUnit<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  // Use a concrete instantiation for most checks
  type ConcreteBase = BaseUnit<readonly ["node"], readonly ["go", "jvm"]>;

  it("has a string `name` property", () => {
    expectTypeOf<ConcreteBase["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<ConcreteBase["version"]>().toEqualTypeOf<string>();
  });

  it("carries the exact required tuple type from its first generic parameter", () => {
    expectTypeOf<ConcreteBase["required"]>().toEqualTypeOf<readonly ["node"]>();
  });

  it("carries the exact optional tuple type from its second generic parameter", () => {
    expectTypeOf<ConcreteBase["optional"]>().toEqualTypeOf<readonly ["go", "jvm"]>();
  });

  it("has an optional `capabilities` property typed as string[]", () => {
    expectTypeOf<ConcreteBase["capabilities"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("allows omitting the capabilities property", () => {
    type WithoutCapabilities = {
      name: string;
      version: string;
      required: readonly ["node"];
      optional: readonly ["go", "jvm"];
    };

    expectTypeOf<WithoutCapabilities>().toExtend<ConcreteBase>();
  });

  it("is generic -- different tuple parameters produce different types", () => {
    type A = BaseUnit<readonly ["node"], readonly []>;
    type B = BaseUnit<readonly ["jvm", "kotlin"], readonly ["node"]>;

    expectTypeOf<A["required"]>().toEqualTypeOf<readonly ["node"]>();
    expectTypeOf<B["required"]>().toEqualTypeOf<readonly ["jvm", "kotlin"]>();

    // The two instantiations are structurally distinct
    expectTypeOf<A["required"]>().not.toEqualTypeOf<B["required"]>();
  });

  it("accepts readonly string[] as an unconstrained generic argument", () => {
    type Unconstrained = BaseUnit<readonly string[], readonly string[]>;

    expectTypeOf<Unconstrained["required"]>().toEqualTypeOf<readonly string[]>();
    expectTypeOf<Unconstrained["optional"]>().toEqualTypeOf<readonly string[]>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof BaseUnit<readonly string[], readonly string[]>>().toEqualTypeOf<
      "name" | "version" | "required" | "optional" | "capabilities"
    >();
  });
});
