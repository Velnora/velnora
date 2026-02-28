import type { Promisable } from "type-fest";
import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../../package-manager";
import type { Project } from "../../project";
import type { Artifact } from "../../utils";
import type { CompileResult } from "./compile-result";
import type { ExecuteOptions } from "./execute-options";
import type { ProcessHandle } from "./process-handle";
import type { ResolvedToolchain } from "./resolved-toolchain";
import type { TestResult } from "./test-result";
import type { Toolchain } from "./toolchain";
import type { ToolchainContext } from "./toolchain-context";
import type { ToolchainFeatures } from "./toolchain-features";
import type { ToolchainProcess } from "./toolchain-process";

describe("Toolchain interface (type-level)", () => {
  describe("identity properties", () => {
    it("has a required string `runtime` property", () => {
      expectTypeOf<Toolchain["runtime"]>().toEqualTypeOf<string>();
    });
  });

  describe("resolution methods", () => {
    it("has a `detect` method that accepts a string and returns Promise<boolean>", () => {
      expectTypeOf<Toolchain["detect"]>().toEqualTypeOf<(cwd: string) => Promisable<boolean>>();
    });

    it("has a `resolve` method that accepts ToolchainContext and returns Promise<ResolvedToolchain>", () => {
      expectTypeOf<Toolchain["resolve"]>().toEqualTypeOf<
        (ctx: ToolchainContext<string[], string[]>) => Promisable<ResolvedToolchain>
      >();
    });
  });

  describe("lifecycle methods", () => {
    it("has a `compile` method returning ToolchainProcess<CompileResult>", () => {
      expectTypeOf<Toolchain["compile"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<CompileResult>>();
    });

    it("has an `execute` method returning ToolchainProcess<ProcessHandle>", () => {
      expectTypeOf<Toolchain["execute"]>().toEqualTypeOf<
        (project: Project, opts?: ExecuteOptions) => ToolchainProcess<ProcessHandle>
      >();
    });

    it("has a `test` method returning ToolchainProcess<TestResult>", () => {
      expectTypeOf<Toolchain["test"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<TestResult>>();
    });

    it("has a `package` method returning ToolchainProcess<Artifact>", () => {
      expectTypeOf<Toolchain["package"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<Artifact>>();
    });
  });

  describe("package management", () => {
    it("has a `resolvePackageManager` method returning Promise<PackageManager>", () => {
      expectTypeOf<Toolchain["resolvePackageManager"]>().toEqualTypeOf<
        (cwd: string) => Promisable<PackageManager> | void
      >();
    });
  });

  describe("optional extensions", () => {
    it("has an optional `features` property typed as ToolchainFeatures", () => {
      expectTypeOf<Toolchain["features"]>().toEqualTypeOf<ToolchainFeatures | undefined>();
    });
  });

  it("is not assignable from an empty object (many required properties)", () => {
    expectTypeOf<object>().not.toExtend<Toolchain>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Toolchain>().toEqualTypeOf<
      | "runtime"
      | "detect"
      | "resolve"
      | "compile"
      | "execute"
      | "test"
      | "package"
      | "resolvePackageManager"
      | "features"
    >();
  });
});
