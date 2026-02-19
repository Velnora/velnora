import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../package-manager";
import type { Project } from "../project";
import type { Artifact } from "../utils/artifact";
import type { BaseUnit } from "./base-unit";
import type { CompileResult } from "./runtime/compile-result";
import type { ExecuteOptions } from "./runtime/execute-options";
import type { ProcessHandle } from "./runtime/process-handle";
import type { ResolvedToolchain } from "./runtime/resolved-toolchain";
import type { TestResult } from "./runtime/test-result";
import type { Toolchain } from "./runtime/toolchain";
import type { ToolchainContext } from "./runtime/toolchain-context";
import type { ToolchainFeatures } from "./runtime/toolchain-features";
import type { ToolchainProcess } from "./runtime/toolchain-process";
import type { RuntimeUnit } from "./runtime-unit";
import { UnitKind } from "./unit-kind";
import type { VelnoraUnit } from "./velnora-unit";

// ---------------------------------------------------------------------------
// UnitKind
// ---------------------------------------------------------------------------
describe("UnitKind enum (type-level)", () => {
  it("has a RUNTIME member equal to the string 'runtime'", () => {
    expectTypeOf(UnitKind.RUNTIME).toEqualTypeOf<UnitKind.RUNTIME>();
    expectTypeOf<typeof UnitKind.RUNTIME>().toEqualTypeOf<UnitKind.RUNTIME>();
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const value: string = UnitKind.RUNTIME;
    expectTypeOf(value).toBeString();
  });

  it("has an ADAPTER member equal to the string 'adapter'", () => {
    expectTypeOf(UnitKind.ADAPTER).toEqualTypeOf<UnitKind.ADAPTER>();
    expectTypeOf<typeof UnitKind.ADAPTER>().toEqualTypeOf<UnitKind.ADAPTER>();
  });

  it("has an INTEGRATION member equal to the string 'integration'", () => {
    expectTypeOf(UnitKind.INTEGRATION).toEqualTypeOf<UnitKind.INTEGRATION>();
    expectTypeOf<typeof UnitKind.INTEGRATION>().toEqualTypeOf<UnitKind.INTEGRATION>();
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
// BaseUnit<R, O>
// ---------------------------------------------------------------------------
describe("BaseUnit<R, O> interface (type-level)", () => {
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
// RuntimeUnit<R, O>
// ---------------------------------------------------------------------------
describe("RuntimeUnit<R, O> interface (type-level)", () => {
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
      expectTypeOf<RuntimeUnit["resolve"]>().toEqualTypeOf<
        (ctx: ToolchainContext) => Promise<ResolvedToolchain>
      >();
    });

    it("has `compile` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["compile"]>().toEqualTypeOf<
        (project: Project) => ToolchainProcess<CompileResult>
      >();
    });

    it("has `execute` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["execute"]>().toEqualTypeOf<
        (project: Project, opts?: ExecuteOptions) => ToolchainProcess<ProcessHandle>
      >();
    });

    it("has `test` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["test"]>().toEqualTypeOf<
        (project: Project) => ToolchainProcess<TestResult>
      >();
    });

    it("has `package` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["package"]>().toEqualTypeOf<
        (project: Project) => ToolchainProcess<Artifact>
      >();
    });

    it("has `packageManagers` property typed as PackageManager[]", () => {
      expectTypeOf<RuntimeUnit["packageManagers"]>().toEqualTypeOf<PackageManager[]>();
    });

    it("has `resolvePackageManager` method with correct signature", () => {
      expectTypeOf<RuntimeUnit["resolvePackageManager"]>().toEqualTypeOf<
        (cwd: string) => Promise<PackageManager>
      >();
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
