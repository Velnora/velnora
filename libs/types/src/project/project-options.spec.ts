import type { PackageJson } from "type-fest";
import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraAppConfig } from "../config";
import type { ProjectOptions } from "./project-options";

describe("ProjectOptions interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<ProjectOptions["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `root` property", () => {
    expectTypeOf<ProjectOptions["root"]>().toEqualTypeOf<string>();
  });

  it("has a `packageJson` property typed as PackageJson", () => {
    expectTypeOf<ProjectOptions["packageJson"]>().toEqualTypeOf<PackageJson>();
  });

  it("has a `config` property typed as VelnoraAppConfig", () => {
    expectTypeOf<ProjectOptions["config"]>().toEqualTypeOf<VelnoraAppConfig>();
  });

  it("has exactly 4 keys", () => {
    expectTypeOf<keyof ProjectOptions>().toEqualTypeOf<"name" | "root" | "packageJson" | "config">();
  });

  it("is not assignable from an empty object", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<{}>().not.toExtend<ProjectOptions>();
  });
});
