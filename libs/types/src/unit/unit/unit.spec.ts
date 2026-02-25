import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../../package-manager";
import type { Project } from "../../project";
import type { Artifact } from "../../utils";
import type { BaseUnitContext } from "../integration";
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
// BaseUnit<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("BaseUnit<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  // Use a concrete instantiation for most checks
  type ConcreteBase = BaseUnit<readonly ["node"], readonly ["go", "jvm"]>;

  it("has a string `name` property", () => {
    expectTypeOf<ConcreteBase["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<ConcreteBase["version"]>().toEqualTypeOf<string>();
  });

  it("carries the exact required tuple type from its first generic parameter", () => {
    expectTypeOf<ConcreteBase["required"]>().toEqualTypeOf<readonly ["node"]>();
  });

  it("carries the exact optional tuple type from its second generic parameter", () => {
    expectTypeOf<ConcreteBase["optional"]>().toEqualTypeOf<readonly ["go", "jvm"]>();
  });

  it("has an optional `capabilities` property typed as string[]", () => {
    expectTypeOf<ConcreteBase["capabilities"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("allows omitting the capabilities property", () => {
    type WithoutCapabilities = {
      name: string;
      version: string;
      required: readonly ["node"];
      optional: readonly ["go", "jvm"];
    };

    expectTypeOf<WithoutCapabilities>().toExtend<ConcreteBase>();
  });

  it("is generic -- different tuple parameters produce different types", () => {
    type A = BaseUnit<readonly ["node"], readonly []>;
    type B = BaseUnit<readonly ["jvm", "kotlin"], readonly ["node"]>;

    expectTypeOf<A["required"]>().toEqualTypeOf<readonly ["node"]>();
    expectTypeOf<B["required"]>().toEqualTypeOf<readonly ["jvm", "kotlin"]>();

    // The two instantiations are structurally distinct
    expectTypeOf<A["required"]>().not.toEqualTypeOf<B["required"]>();
  });

  it("accepts readonly string[] as an unconstrained generic argument", () => {
    type Unconstrained = BaseUnit<readonly string[], readonly string[]>;

    expectTypeOf<Unconstrained["required"]>().toEqualTypeOf<readonly string[]>();
    expectTypeOf<Unconstrained["optional"]>().toEqualTypeOf<readonly string[]>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof BaseUnit<readonly string[], readonly string[]>>().toEqualTypeOf<
      "name" | "version" | "required" | "optional" | "capabilities"
    >();
  });
});

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

// ---------------------------------------------------------------------------
// VelnoraUnit
// ---------------------------------------------------------------------------
describe("VelnoraUnit type alias (type-level)", () => {
  it("RuntimeUnit is assignable to VelnoraUnit", () => {
    expectTypeOf<RuntimeUnit>().toExtend<VelnoraUnit>();
  });

  it("VelnoraUnit is assignable to RuntimeUnit (currently equivalent)", () => {
    expectTypeOf<VelnoraUnit>().toExtend<RuntimeUnit>();
  });

  it("VelnoraUnit equals RuntimeUnit at this point in time", () => {
    expectTypeOf<VelnoraUnit>().toEqualTypeOf<RuntimeUnit>();
  });

  it("has `kind` discriminant of UnitKind.RUNTIME", () => {
    expectTypeOf<VelnoraUnit["kind"]>().toEqualTypeOf<UnitKind.RUNTIME>();
  });

  it("inherits BaseUnit metadata via RuntimeUnit", () => {
    expectTypeOf<VelnoraUnit>().toExtend<BaseUnit<readonly string[], readonly string[]>>();
  });

  it("inherits Toolchain lifecycle via RuntimeUnit", () => {
    expectTypeOf<VelnoraUnit>().toExtend<Toolchain>();
  });
});

// ---------------------------------------------------------------------------
// IntegrationUnit<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("IntegrationUnit<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  describe("discriminant", () => {
    it("has `kind` narrowed to the literal 'integration'", () => {
      expectTypeOf<IntegrationUnit["kind"]>().toExtend<"integration">();
    });
  });

  describe("default generic parameters", () => {
    it("defaults TRequiredUnits to readonly []", () => {
      expectTypeOf<IntegrationUnit["required"]>().toEqualTypeOf<readonly []>();
    });

    it("defaults TOptionalUnits to readonly []", () => {
      expectTypeOf<IntegrationUnit["optional"]>().toEqualTypeOf<readonly []>();
    });
  });

  describe("BaseUnit inheritance", () => {
    it("extends BaseUnit", () => {
      expectTypeOf<IntegrationUnit>().toExtend<BaseUnit<readonly [], readonly []>>();
    });

    it("inherits `name` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["name"]>().toBeString();
    });

    it("inherits `version` as string from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["version"]>().toBeString();
    });

    it("inherits optional `capabilities` from BaseUnit", () => {
      expectTypeOf<IntegrationUnit["capabilities"]>().toEqualTypeOf<string[] | undefined>();
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

    it("`configure` returns void or Promise<void>", () => {
      type ConfigureReturn = ReturnType<NonNullable<IntegrationUnit["configure"]>>;
      expectTypeOf<ConfigureReturn>().toExtend<void | Promise<void>>();
    });

    it("`build` returns void or Promise<void>", () => {
      type BuildReturn = ReturnType<NonNullable<IntegrationUnit["build"]>>;
      expectTypeOf<BuildReturn>().toExtend<void | Promise<void>>();
    });
  });

  describe("has exactly the expected keys", () => {
    it("includes kind, name, version, required, optional, capabilities, configure, build", () => {
      expectTypeOf<keyof IntegrationUnit>().toEqualTypeOf<
        "kind" | "name" | "version" | "required" | "optional" | "capabilities" | "configure" | "build"
      >();
    });
  });
});

// ---------------------------------------------------------------------------
// UnitContext<TRequiredUnits, TOptionalUnits>
// ---------------------------------------------------------------------------
describe("UnitContext<TRequiredUnits, TOptionalUnits> interface (type-level)", () => {
  it("is an object type", () => {
    expectTypeOf<BaseUnitContext>().toBeObject();
  });

  it("has an `expose` method", () => {
    expectTypeOf<BaseUnitContext["expose"]>().toBeFunction();
  });

  it("has a `query` method", () => {
    expectTypeOf<BaseUnitContext["query"]>().toBeFunction();
  });

  it("has exactly `expose` and `query` keys", () => {
    expectTypeOf<keyof BaseUnitContext>().toEqualTypeOf<"expose" | "query">();
  });
});
