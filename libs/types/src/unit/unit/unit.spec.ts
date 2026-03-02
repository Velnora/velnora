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
import type { AdapterUnit } from "./adapter-unit";
import type { BaseUnit } from "./base-unit";
import type { BaseUnitContext } from "./base-unit-context";
import type { IntegrationUnit } from "./integration-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";
import type { VelnoraUnit } from "./velnora-unit";

// ---------------------------------------------------------------------------
// UnitKind
// ---------------------------------------------------------------------------
describe("UnitKind enum (type-level)", () => {
  it("has a RUNTIME member assignable to 'runtime'", () => {
    expectTypeOf<UnitKind.RUNTIME>().toExtend<"runtime">();
  });

  it("has an ADAPTER member assignable to 'adapter'", () => {
    expectTypeOf<UnitKind.ADAPTER>().toExtend<"adapter">();
  });

  it("has an INTEGRATION member assignable to 'integration'", () => {
    expectTypeOf<UnitKind.INTEGRATION>().toExtend<"integration">();
  });

  it("members are assignable to string", () => {
    expectTypeOf<UnitKind.RUNTIME>().toExtend<string>();
    expectTypeOf<UnitKind.ADAPTER>().toExtend<string>();
    expectTypeOf<UnitKind.INTEGRATION>().toExtend<string>();
  });

  it("string is NOT assignable to UnitKind (narrowing check)", () => {
    expectTypeOf<string>().not.toExtend<UnitKind>();
  });

  it("is a union of exactly three members", () => {
    expectTypeOf<UnitKind>().toEqualTypeOf<UnitKind.RUNTIME | UnitKind.ADAPTER | UnitKind.INTEGRATION>();
  });
});

// ---------------------------------------------------------------------------
// BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
// ---------------------------------------------------------------------------
describe("BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities> interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<BaseUnit["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<BaseUnit["version"]>().toEqualTypeOf<string>();
  });

  it("has an optional `required` property", () => {
    expectTypeOf<BaseUnit["required"]>().toExtend<string[] | undefined>();
  });

  it("has an optional `optional` property", () => {
    expectTypeOf<BaseUnit["optional"]>().toExtend<string[] | undefined>();
  });

  it("has an optional `capabilities` property", () => {
    expectTypeOf<BaseUnit["capabilities"]>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
  });

  it("has an optional `units` property", () => {
    expectTypeOf<BaseUnit>().toHaveProperty("units");
  });

  it("has an optional `configure` method", () => {
    expectTypeOf<BaseUnit>().toHaveProperty("configure");
    type ConfigureFn = NonNullable<BaseUnit["configure"]>;
    expectTypeOf<ConfigureFn>().toBeFunction();
  });

  it("is generic -- different tuple parameters produce different types", () => {
    type A = BaseUnit<["node"], []>;
    type B = BaseUnit<["jvm", "kotlin"], ["node"]>;

    expectTypeOf<A["required"]>().not.toEqualTypeOf<B["required"]>();
  });

  it("can be instantiated with zero type arguments (all have defaults)", () => {
    expectTypeOf<BaseUnit>().toBeObject();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof BaseUnit>().toEqualTypeOf<
      "name" | "version" | "required" | "optional" | "capabilities" | "units" | "configure"
    >();
  });
});

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
      expectTypeOf<RuntimeUnit["required"]>().toExtend<string[] | undefined>();
    });

    it("defaults TOptionalUnits to string[] (via LiteralUnion)", () => {
      expectTypeOf<RuntimeUnit["optional"]>().toExtend<string[] | undefined>();
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

// ---------------------------------------------------------------------------
// VelnoraUnit (discriminated union)
// ---------------------------------------------------------------------------
describe("VelnoraUnit type alias (type-level)", () => {
  it("RuntimeUnit is assignable to VelnoraUnit", () => {
    expectTypeOf<RuntimeUnit>().toExtend<VelnoraUnit>();
  });

  it("IntegrationUnit is assignable to VelnoraUnit", () => {
    expectTypeOf<IntegrationUnit>().toExtend<VelnoraUnit>();
  });

  it("AdapterUnit is assignable to VelnoraUnit", () => {
    expectTypeOf<AdapterUnit>().toExtend<VelnoraUnit>();
  });

  it("VelnoraUnit is NOT equivalent to RuntimeUnit alone", () => {
    expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<RuntimeUnit>();
  });

  it("VelnoraUnit is NOT equivalent to IntegrationUnit alone", () => {
    expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<IntegrationUnit>();
  });

  it("VelnoraUnit is NOT equivalent to AdapterUnit alone", () => {
    expectTypeOf<VelnoraUnit>().not.toEqualTypeOf<AdapterUnit>();
  });

  it("has `kind` covering the full UnitKind enum", () => {
    expectTypeOf<VelnoraUnit["kind"]>().toEqualTypeOf<UnitKind>();
  });

  it("all union members share `name` as string", () => {
    expectTypeOf<VelnoraUnit["name"]>().toBeString();
  });

  it("all union members share `version` as string", () => {
    expectTypeOf<VelnoraUnit["version"]>().toBeString();
  });
});

// ---------------------------------------------------------------------------
// IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
// ---------------------------------------------------------------------------
describe("IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to the literal 'integration'", () => {
      expectTypeOf<IntegrationUnit["kind"]>().toExtend<"integration">();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to string[] (via LiteralUnion)", () => {
      expectTypeOf<IntegrationUnit["required"]>().toExtend<string[] | undefined>();
    });

    it("defaults TOptionalUnits to string[] (via LiteralUnion)", () => {
      expectTypeOf<IntegrationUnit["optional"]>().toExtend<string[] | undefined>();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toExtend<BaseUnit>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["capabilities"]>().toExtend<(keyof Velnora.UnitRegistry)[] | undefined>();
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

    it("`configure` return type includes void", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<void>().toExtend<ConfigureReturn>();
    });

    it("`configure` return type includes Promise<void>", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<Promise<void>>().toExtend<ConfigureReturn>();
    });

    it("`build` return type includes void", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<void>().toExtend<BuildReturn>();
    });

    it("`build` return type includes Promise<void>", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<Promise<void>>().toExtend<BuildReturn>();
    });
  });

  describe("has exactly the expected keys", () => {
    it("includes kind, name, version, required, optional, capabilities, units, configure, build", () => {
      expectTypeOf<keyof IntegrationUnit>().toEqualTypeOf<
        "kind" | "name" | "version" | "required" | "optional" | "capabilities" | "units" | "configure" | "build"
      >();
    });
  });
});

// ---------------------------------------------------------------------------
// BaseUnitContext<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("BaseUnitContext<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  it("is an object type", () => {
    expectTypeOf<BaseUnitContext>().toBeObject();
  });

  it("has a `query` method", () => {
    expectTypeOf<BaseUnitContext["query"]>().toBeFunction();
  });

  it("has exactly `query` key (no `expose`)", () => {
    expectTypeOf<keyof BaseUnitContext>().toEqualTypeOf<"query">();
  });
});
