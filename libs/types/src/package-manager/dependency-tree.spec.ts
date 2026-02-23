import { describe, expectTypeOf, it } from "vitest";

import type { DependencyTree } from "./dependency-tree";
import type { ResolvedDependency } from "./resolved-dependency";

describe("DependencyTree interface (type-level)", () => {
  it("has a `dependencies` property typed as ResolvedDependency[]", () => {
    expectTypeOf<DependencyTree["dependencies"]>().toEqualTypeOf<ResolvedDependency[]>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof DependencyTree>().toEqualTypeOf<"dependencies">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = { dependencies: ResolvedDependency[] };
    expectTypeOf<Valid>().toExtend<DependencyTree>();
  });

  it("is not assignable from an empty object", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().not.toExtend<DependencyTree>();
  });
});
