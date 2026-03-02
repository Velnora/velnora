import type { Promisable } from "type-fest";
import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../../package-manager";
import type { Project } from "../../project";
import type { Artifact } from "../../utils";
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
} from "../runtime";
import type { BaseUnit } from "./base-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";

// ---------------------------------------------------------------------------
// RuntimeUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
// ---------------------------------------------------------------------------
describe("RuntimeUnit<TRequiredUnits, TOptionalUnits, TCapabilities> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to UnitKind.RUNTIME, not the full UnitKind union", () => {
      expectTypeOf<RuntimeUnit["kind"]>().toEqualTypeOf<UnitKind.RUNTIME>();
      expectTypeOf<RuntimeUnit["kind"]>().not.toEqualTypeOf<UnitKind>();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to string[] (via LiteralUnion)", () => {
      type Req = RuntimeUnit["required"];
      expectTypeOf<Req>().toExtend<string[] | undefined>();
    });

    it("defaults TOptionalUnits to string[] (via LiteralUnion)", () => {
      type Opt = RuntimeUnit["optional"];
      expectTypeOf<Opt>().toExtend<string[] | undefined>();
    });

    it("defaults TCapabilities to (keyof Velnora.UnitRegistry)[]", () => {
      type Cap = RuntimeUnit["capabilities"];
      expectTypeOf<Cap>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
    });

    it("can be instantiated with zero type arguments (all have defaults)", () => {
      // This simply checks that `RuntimeUnit` (no explicit generics) is a valid type.
      expectTypeOf<RuntimeUnit>().toBeObject();
    });
  });

  describe("specific generic parameters", () => {
    type Specific = RuntimeUnit<["node"], ["go"]>;

    it("carries exact tuple types when generic parameters are specified", () => {
      expectTypeOf<Specific["required"]>().toEqualTypeOf<["node"] | undefined>();
      expectTypeOf<Specific["optional"]>().toEqualTypeOf<["go"] | undefined>();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit (is assignable to BaseUnit with matching generics)", () => {
      expectTypeOf<RuntimeUnit>().toExtend<BaseUnit>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<RuntimeUnit["capabilities"]>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
    });

    it("inherits optional `units` from BaseUnit", () => {
      expectTypeOf<RuntimeUnit>().toHaveProperty("units");
    });

    it("inherits optional `configure` from BaseUnit", () => {
      expectTypeOf<RuntimeUnit>().toHaveProperty("configure");
    });
  });

  describe("Toolchain inheritance", () => {
    it("extends Toolchain", () => {
      expectTypeOf<RuntimeUnit>().toExtend<Toolchain>();
    });

    it("has Toolchain `runtime` property (string)", () => {
      expectTypeOf<RuntimeUnit["runtime"]>().toEqualTypeOf<string>();
    });

    it("has `detect` method returning Promisable<boolean>", () => {
      expectTypeOf<RuntimeUnit["detect"]>().toEqualTypeOf<(cwd: string) => Promisable<boolean>>();
    });

    it("has `resolve` method returning Promisable<ResolvedToolchain>", () => {
      expectTypeOf<RuntimeUnit["resolve"]>().toEqualTypeOf<
        (ctx: ToolchainContext) => Promisable<ResolvedToolchain>
      >();
    });

    it("has optional `compile` method with correct signature", () => {
      type CompileFn = NonNullable<RuntimeUnit["compile"]>;
      expectTypeOf<CompileFn>().toEqualTypeOf<(project: Project) => ToolchainProcess<CompileResult>>();
    });

    it("has optional `execute` method with correct signature", () => {
      type ExecuteFn = NonNullable<RuntimeUnit["execute"]>;
      expectTypeOf<ExecuteFn>().toEqualTypeOf<
        (project: Project, opts?: ExecuteOptions) => ToolchainProcess<ProcessHandle>
      >();
    });

    it("has optional `test` method with correct signature", () => {
      type TestFn = NonNullable<RuntimeUnit["test"]>;
      expectTypeOf<TestFn>().toEqualTypeOf<(project: Project) => ToolchainProcess<TestResult>>();
    });

    it("has optional `package` method with correct signature", () => {
      type PackageFn = NonNullable<RuntimeUnit["package"]>;
      expectTypeOf<PackageFn>().toEqualTypeOf<(project: Project) => ToolchainProcess<Artifact>>();
    });

    it("has `resolvePackageManager` method returning Promisable<PackageManager> | void", () => {
      expectTypeOf<RuntimeUnit["resolvePackageManager"]>().toEqualTypeOf<
        (cwd: string) => Promisable<PackageManager> | void
      >();
    });

    it("has optional `features` property typed as ToolchainFeatures", () => {
      expectTypeOf<RuntimeUnit["features"]>().toEqualTypeOf<ToolchainFeatures | undefined>();
    });
  });
});
