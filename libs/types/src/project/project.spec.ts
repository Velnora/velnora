import type { PackageJson } from "type-fest";
import { describe, expectTypeOf, it } from "vitest";

import type { VelnoraAppConfig } from "../config";
import type { Project } from "./project";

describe("Project interface (type-level)", () => {
  it("has a string `name` field", () => {
    expectTypeOf<Project["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `displayName` field", () => {
    expectTypeOf<Project["displayName"]>().toEqualTypeOf<string>();
  });

  it("has a string `root` field", () => {
    expectTypeOf<Project["root"]>().toEqualTypeOf<string>();
  });

  it("has a string `path` field", () => {
    expectTypeOf<Project["path"]>().toEqualTypeOf<string>();
  });

  it("has a `packageJson` field typed as PackageJson", () => {
    expectTypeOf<Project["packageJson"]>().toEqualTypeOf<PackageJson>();
  });

  it("has a `config` field typed as VelnoraAppConfig", () => {
    expectTypeOf<Project["config"]>().toEqualTypeOf<VelnoraAppConfig>();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = {
      name: string;
      displayName: string;
      root: string;
      path: string;
      packageJson: PackageJson;
      config: VelnoraAppConfig;
    };

    expectTypeOf<Valid>().toExtend<Project>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Project>().toEqualTypeOf<"name" | "displayName" | "root" | "path" | "packageJson" | "config">();
  });
});
