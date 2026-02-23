import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../package-manager";
import type { Project } from "../project";
import type { Artifact } from "../utils";
import type { BaseUnit } from "./base-unit";
import type {
  CompileResult,
  ExecuteOptions,
  ProcessHandle,
  ResolvedToolchain,
  TestResult,
  Toolchain,
  ToolchainContext,
  ToolchainFeatures,
  ToolchainProcess
} from "./runtime";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";

// ---------------------------------------------------------------------------
// RuntimeUnit<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("RuntimeUnit<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to UnitKind.RUNTIME, not the full UnitKind union", () => {
      expectTypeOf<RuntimeUnit["kind"]>().toEqualTypeOf<UnitKind.RUNTIME>();
      expectTypeOf<RuntimeUnit["kind"]>().not.toEqualTypeOf<UnitKind>();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to readonly string[]", () => {
      expectTypeOf<RuntimeUnit["required"]>().toEqualTypeOf<readonly string[]>();
    });

    it("defaults TOptionalUnits to readonly string[]", () => {
      expectTypeOf<RuntimeUnit["optional"]>().toEqualTypeOf<readonly string[]>();
    });
  });

  describe("specific generic parameters", () => {
    type Specific = RuntimeUnit<readonly ["node"], readonly ["go"]>;

    it("carries exact tuple types when generic parameters are specified", () => {
      expectTypeOf<Specific["required"]>().toEqualTypeOf<readonly ["node"]>();
      expectTypeOf<Specific["optional"]>().toEqualTypeOf<readonly ["go"]>();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit (is assignable to BaseUnit with matching generics)", () => {
      expectTypeOf<RuntimeUnit>().toExtend<BaseUnit<readonly string[], readonly string[]>>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["capabilities"]>().toEqualTypeOf<string[] | undefined>();
    });
  });

  describe("Toolchain inheritance", () => {
    it("extends Toolchain", () => {
      expectTypeOf<RuntimeUnit>().toExtend<Toolchain>();
    });

    it("has Toolchain `name` property (string)", () => {
      expectTypeOf<RuntimeUnit["name"]>().toEqualTypeOf<string>();
    });

    it("has Toolchain `runtime` property (string)", () => {
      expectTypeOf<RuntimeUnit["runtime"]>().toEqualTypeOf<string>();
    });

    it("has `detect` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["detect"]>().toEqualTypeOf<(cwd: string) => Promise<boolean>>();
    });

    it("has `resolve` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["resolve"]>().toEqualTypeOf<(ctx: ToolchainContext) => Promise<ResolvedToolchain>>();
    });

    it("has `compile` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["compile"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<CompileResult>>();
    });

    it("has `execute` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["execute"]>().toEqualTypeOf<
        (project: Project, opts?: ExecuteOptions) => ToolchainProcess<ProcessHandle>
      >();
    });

    it("has `test` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["test"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<TestResult>>();
    });

    it("has `package` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["package"]>().toEqualTypeOf<(project: Project) => ToolchainProcess<Artifact>>();
    });

    it("has `packageManagers` property typed as PackageManager[]", () => {
      expectTypeOf<RuntimeUnit["packageManagers"]>().toEqualTypeOf<PackageManager[]>();
    });

    it("has `resolvePackageManager` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["resolvePackageManager"]>().toEqualTypeOf<(cwd: string) => Promise<PackageManager>>();
    });

    it("has optional `features` property typed as ToolchainFeatures", () => {
      expectTypeOf<RuntimeUnit["features"]>().toEqualTypeOf<ToolchainFeatures | undefined>();
    });
  });
});
