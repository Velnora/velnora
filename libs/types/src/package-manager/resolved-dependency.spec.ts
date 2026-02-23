import { describe, expectTypeOf, it } from "vitest";

import type { DependencyScope } from "./depdendency-scope";
import type { ResolvedDependency } from "./resolved-dependency";

describe("ResolvedDependency interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<ResolvedDependency["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<ResolvedDependency["version"]>().toEqualTypeOf<string>();
  });

  it("has a `scope` property typed as DependencyScope", () => {
    expectTypeOf<ResolvedDependency["scope"]>().toEqualTypeOf<DependencyScope>();
  });

  it("has an optional `children` property typed as ResolvedDependency[]", () => {
    expectTypeOf<ResolvedDependency["children"]>().toEqualTypeOf<ResolvedDependency[] | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ResolvedDependency>().toEqualTypeOf<"name" | "version" | "scope" | "children">();
  });

  it("is assignable from a valid object literal with all properties", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
      children: ResolvedDependency[];
    };

    expectTypeOf<Valid>().toExtend<ResolvedDependency>();
  });

  it("is assignable from a valid object literal without optional children", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
    };

    expectTypeOf<Valid>().toExtend<ResolvedDependency>();
  });

  it("children elements are themselves ResolvedDependency", () => {
    type Child = NonNullable<ResolvedDependency["children"]>[number];
    expectTypeOf<Child>().toEqualTypeOf<ResolvedDependency>();
  });

  it("supports recursive nesting (children of children)", () => {
    type Child = NonNullable<ResolvedDependency["children"]>[number];
    type GrandChild = NonNullable<Child["children"]>[number];
    expectTypeOf<GrandChild>().toEqualTypeOf<ResolvedDependency>();
  });

  it("is not assignable without required `version` property", () => {
    expectTypeOf<{ name: string; scope: DependencyScope }>().not.toExtend<ResolvedDependency>();
  });

  it("is not assignable without required `scope` property", () => {
    expectTypeOf<{ name: string; version: string }>().not.toExtend<ResolvedDependency>();
  });
});
