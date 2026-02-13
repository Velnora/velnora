import type { PackageJson } from "type-fest";
import { describe, it } from "vitest";

import type { VelnoraAppConfig } from "../config/velnora-app";
import type { Project } from "./project";

/**
 * Compile-time assertion: if `T` does not extend `U`, this produces a type error.
 * Used to verify that an interface field is exactly the type we expect.
 */
type AssertEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : never) : never;

/**
 * Compile-time assertion: produces a type error if `T` does not extend `U`.
 */
type AssertExtends<T, U> = T extends U ? true : never;

describe("Project interface (type-level)", () => {
  it("should have a string `name` field", () => {
    const _check: AssertEqual<Project["name"], string> = true;
  });

  it("should have a readonly string `displayName` field", () => {
    const _check: AssertEqual<Project["displayName"], string> = true;
  });

  it("should have a string `root` field", () => {
    const _check: AssertEqual<Project["root"], string> = true;
  });

  it("should have a `packageJson` field typed as PackageJson", () => {
    const _check: AssertEqual<Project["packageJson"], PackageJson> = true;
  });

  it("should have a `config` field typed as VelnoraAppConfig", () => {
    const _check: AssertEqual<Project["config"], VelnoraAppConfig> = true;
  });

  it("should be assignable from a valid object literal", () => {
    const _check: AssertExtends<
      {
        name: string;
        displayName: string;
        root: string;
        packageJson: PackageJson;
        config: VelnoraAppConfig;
      },
      Project
    > = true;
  });

  it("should have exactly the expected keys", () => {
    const _check: AssertEqual<keyof Project, "name" | "displayName" | "root" | "packageJson" | "config"> = true;
  });
});
