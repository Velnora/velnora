import { describe, expectTypeOf, it } from "vitest";

import type { UnitContext } from "../integration";
import type { BaseUnit } from "./base-unit";
import type { IntegrationUnit } from "./integration-unit";

// ---------------------------------------------------------------------------
// IntegrationUnit<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("IntegrationUnit<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to the literal 'integration'", () => {
      expectTypeOf<IntegrationUnit["kind"]>().toExtend<"integration">();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to readonly []", () => {
      expectTypeOf<IntegrationUnit["required"]>().toEqualTypeOf<readonly []>();
    });

    it("defaults TOptionalUnits to readonly []", () => {
      expectTypeOf<IntegrationUnit["optional"]>().toEqualTypeOf<readonly []>();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toExtend<BaseUnit<readonly [], readonly []>>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["capabilities"]>().toEqualTypeOf<string[] | undefined>();
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

    it("`configure` returns void or Promise<void>", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<ConfigureReturn>().toExtend<void | Promise<void>>();
    });

    it("`build` returns void or Promise<void>", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<BuildReturn>().toExtend<void | Promise<void>>();
    });
  });

  describe("has exactly the expected keys", () => {
    it("includes kind, name, version, required, optional, capabilities, configure, build", () => {
      expectTypeOf<keyof IntegrationUnit>().toEqualTypeOf<
        "kind" | "name" | "version" | "required" | "optional" | "capabilities" | "configure" | "build"
      >();
    });
  });
});
