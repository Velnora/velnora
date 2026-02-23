import { describe, expectTypeOf, it } from "vitest";

import type { DependencyScope } from "./depdendency-scope";
import type { Dependency } from "./dependency";

describe("Dependency interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<Dependency["name"]>().toEqualTypeOf<string>();
  });

  it("has an optional string `version` property", () => {
    expectTypeOf<Dependency["version"]>().toEqualTypeOf<string | undefined>();
  });

  it("has an optional `scope` property typed as DependencyScope", () => {
    expectTypeOf<Dependency["scope"]>().toEqualTypeOf<DependencyScope | undefined>();
  });

  it("has an optional string `registry` property", () => {
    expectTypeOf<Dependency["registry"]>().toEqualTypeOf<string | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Dependency>().toEqualTypeOf<"name" | "version" | "scope" | "registry">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
      registry: string;
    };

    expectTypeOf<Valid>().toExtend<Dependency>();
  });

  it("is assignable from a minimal object with only required properties", () => {
    expectTypeOf<{ name: string }>().toExtend<Dependency>();
  });

  it("is not assignable without the required `name` property", () => {
    expectTypeOf<{ version: string }>().not.toExtend<Dependency>();
  });
});
