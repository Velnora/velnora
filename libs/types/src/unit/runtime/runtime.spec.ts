import { describe, expectTypeOf, it } from "vitest";

import type { PackageManager } from "../../package-manager/package-manager";
import type { Project } from "../../project/project";
import type { Artifact } from "../../utils/artifact";
import type { CompileResult } from "./compile-result";
import type { ExecuteOptions } from "./execute-options";
import type { ProcessHandle } from "./process-handle";
import type { ResolvedToolchain } from "./resolved-toolchain";
import type { TestResult } from "./test-result";
import type { TestSuiteResult } from "./test-result-suite";
import type { Toolchain } from "./toolchain";
import type { ToolchainContext } from "./toolchain-context";
import type { ToolchainFeatures } from "./toolchain-features";
import type { ToolchainProcess } from "./toolchain-process";

describe("CompileResult interface (type-level)", () => {
  it("has a boolean `success` property", () => {
    expectTypeOf<CompileResult["success"]>().toEqualTypeOf<boolean>();
  });

  it("has a string `outputDir` property", () => {
    expectTypeOf<CompileResult["outputDir"]>().toEqualTypeOf<string>();
  });

  it("has an optional `errors` property typed as string[]", () => {
    expectTypeOf<CompileResult["errors"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("is assignable from an object without `errors`", () => {
    expectTypeOf<{ success: boolean; outputDir: string }>().toExtend<CompileResult>();
  });

  it("is assignable from an object with `errors`", () => {
    expectTypeOf<{ success: boolean; outputDir: string; errors: string[] }>().toExtend<CompileResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof CompileResult>().toEqualTypeOf<"success" | "outputDir" | "errors">();
  });
});

describe("ExecuteOptions interface (type-level)", () => {
  it("has an optional `args` property typed as string[]", () => {
    expectTypeOf<ExecuteOptions["args"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("has an optional `env` property typed as Record<string, string>", () => {
    expectTypeOf<ExecuteOptions["env"]>().toEqualTypeOf<Record<string, string> | undefined>();
  });

  it("has an optional `port` property typed as number", () => {
    expectTypeOf<ExecuteOptions["port"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional `watch` property typed as boolean", () => {
    expectTypeOf<ExecuteOptions["watch"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<ExecuteOptions>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ExecuteOptions>().toEqualTypeOf<"args" | "env" | "port" | "watch">();
  });
});

describe("ProcessHandle interface (type-level)", () => {
  it("has a required number `pid` property", () => {
    expectTypeOf<ProcessHandle["pid"]>().toEqualTypeOf<number>();
  });

  it("has an optional `port` property typed as number", () => {
    expectTypeOf<ProcessHandle["port"]>().toEqualTypeOf<number | undefined>();
  });

  it("is assignable from an object with only `pid`", () => {
    expectTypeOf<{ pid: number }>().toExtend<ProcessHandle>();
  });

  it("is not assignable from an empty object (pid is required)", () => {
    expectTypeOf<{}>().not.toExtend<ProcessHandle>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ProcessHandle>().toEqualTypeOf<"pid" | "port">();
  });
});

describe("ResolvedToolchain interface (type-level)", () => {
  it("has a required string `binary` property", () => {
    expectTypeOf<ResolvedToolchain["binary"]>().toEqualTypeOf<string>();
  });

  it("has a required string `version` property", () => {
    expectTypeOf<ResolvedToolchain["version"]>().toEqualTypeOf<string>();
  });

  it("is not assignable from an empty object (both properties required)", () => {
    expectTypeOf<{}>().not.toExtend<ResolvedToolchain>();
  });

  it("is assignable from a valid object literal", () => {
    expectTypeOf<{ binary: string; version: string }>().toExtend<ResolvedToolchain>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ResolvedToolchain>().toEqualTypeOf<"binary" | "version">();
  });
});

describe("TestSuiteResult interface (type-level)", () => {
  it("has a required string `name` property", () => {
    expectTypeOf<TestSuiteResult["name"]>().toEqualTypeOf<string>();
  });

  it("has a `tests` property that is an array", () => {
    expectTypeOf<TestSuiteResult["tests"]>().toBeArray();
  });

  it("has test entries with a string `name`", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["name"]>().toEqualTypeOf<string>();
  });

  it("has test entries with a union `status` of passed, failed, or skipped", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["status"]>().toEqualTypeOf<"passed" | "failed" | "skipped">();
  });

  it("has test entries with an optional number `duration`", () => {
    expectTypeOf<TestSuiteResult["tests"][number]["duration"]>().toEqualTypeOf<number | undefined>();
  });

  it("is not assignable from an empty object (name and tests are required)", () => {
    expectTypeOf<{}>().not.toExtend<TestSuiteResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof TestSuiteResult>().toEqualTypeOf<"name" | "tests">();
  });
});

describe("TestResult interface (type-level)", () => {
  it("has a required boolean `success` property", () => {
    expectTypeOf<TestResult["success"]>().toEqualTypeOf<boolean>();
  });

  it("has a required number `total` property", () => {
    expectTypeOf<TestResult["total"]>().toEqualTypeOf<number>();
  });

  it("has a required number `passed` property", () => {
    expectTypeOf<TestResult["passed"]>().toEqualTypeOf<number>();
  });

  it("has a required number `failed` property", () => {
    expectTypeOf<TestResult["failed"]>().toEqualTypeOf<number>();
  });

  it("has an optional number `skipped` property", () => {
    expectTypeOf<TestResult["skipped"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional number `duration` property", () => {
    expectTypeOf<TestResult["duration"]>().toEqualTypeOf<number | undefined>();
  });

  it("has an optional `suites` property typed as TestSuiteResult[]", () => {
    expectTypeOf<TestResult["suites"]>().toEqualTypeOf<TestSuiteResult[] | undefined>();
  });

  it("is assignable from an object with only the required properties", () => {
    expectTypeOf<{
      success: boolean;
      total: number;
      passed: number;
      failed: number;
    }>().toExtend<TestResult>();
  });

  it("is not assignable from an empty object (required properties missing)", () => {
    expectTypeOf<{}>().not.toExtend<TestResult>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof TestResult>().toEqualTypeOf<
      "success" | "total" | "passed" | "failed" | "skipped" | "duration" | "suites"
    >();
  });
});

describe("ToolchainContext interface (type-level)", () => {
  it("has a required string `cwd` property", () => {
    expectTypeOf<ToolchainContext["cwd"]>().toEqualTypeOf<string>();
  });

  it("is not assignable from an empty object (cwd is required)", () => {
    expectTypeOf<{}>().not.toExtend<ToolchainContext>();
  });

  it("is assignable from a valid object literal", () => {
    expectTypeOf<{ cwd: string }>().toExtend<ToolchainContext>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ToolchainContext>().toEqualTypeOf<"cwd">();
  });
});

describe("ToolchainFeatures interface (type-level)", () => {
  it("has an optional boolean `hotReload` property", () => {
    expectTypeOf<ToolchainFeatures["hotReload"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `incrementalBuild` property", () => {
    expectTypeOf<ToolchainFeatures["incrementalBuild"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `nativeImage` property", () => {
    expectTypeOf<ToolchainFeatures["nativeImage"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `workspaces` property", () => {
    expectTypeOf<ToolchainFeatures["workspaces"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `lockfile` property", () => {
    expectTypeOf<ToolchainFeatures["lockfile"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `audit` property", () => {
    expectTypeOf<ToolchainFeatures["audit"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `privateRegistry` property", () => {
    expectTypeOf<ToolchainFeatures["privateRegistry"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<ToolchainFeatures>();
  });
});

describe("ToolchainProcess<T> interface (type-level)", () => {
  it("has a `stdout` property typed as ReadableStream<string>", () => {
    expectTypeOf<ToolchainProcess<unknown>["stdout"]>().toEqualTypeOf<ReadableStream<string>>();
  });

  it("has a `stderr` property typed as ReadableStream<string>", () => {
    expectTypeOf<ToolchainProcess<unknown>["stderr"]>().toEqualTypeOf<ReadableStream<string>>();
  });

  it("has a `result` property typed as Promise<T>", () => {
    expectTypeOf<ToolchainProcess<string>["result"]>().toEqualTypeOf<Promise<string>>();
  });

  it("has a `kill` method returning Promise<void>", () => {
    expectTypeOf<ToolchainProcess<unknown>["kill"]>().toEqualTypeOf<() => Promise<void>>();
  });

  it("flows the generic parameter T through to `result`", () => {
    expectTypeOf<ToolchainProcess<CompileResult>["result"]>().toEqualTypeOf<Promise<CompileResult>>();
  });

  it("preserves generic type with number", () => {
    expectTypeOf<ToolchainProcess<number>["result"]>().toEqualTypeOf<Promise<number>>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ToolchainProcess<unknown>>().toEqualTypeOf<"stdout" | "stderr" | "result" | "kill">();
  });
});

describe("Toolchain interface (type-level)", () => {
  describe("identity properties", () => {
    it("has a required string `name` property", () => {
      expectTypeOf<Toolchain["name"]>().toEqualTypeOf<string>();
    });

    it("has a required string `runtime` property", () => {
      expectTypeOf<Toolchain["runtime"]>().toEqualTypeOf<string>();
    });
  });

  describe("resolution methods", () => {
    it("has a `detect` method that accepts a string and returns Promise<boolean>", () => {
      expectTypeOf<Toolchain["detect"]>().toEqualTypeOf<(cwd: string) => Promise<boolean>>();
    });

    it("has a `resolve` method that accepts ToolchainContext and returns Promise<ResolvedToolchain>", () => {
      expectTypeOf<Toolchain["resolve"]>().toEqualTypeOf<(ctx: ToolchainContext) => Promise<ResolvedToolchain>>();
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
    it("has a `packageManagers` property typed as PackageManager[]", () => {
      expectTypeOf<Toolchain["packageManagers"]>().toEqualTypeOf<PackageManager[]>();
    });

    it("has a `resolvePackageManager` method returning Promise<PackageManager>", () => {
      expectTypeOf<Toolchain["resolvePackageManager"]>().toEqualTypeOf<(cwd: string) => Promise<PackageManager>>();
    });
  });

  describe("optional extensions", () => {
    it("has an optional `features` property typed as ToolchainFeatures", () => {
      expectTypeOf<Toolchain["features"]>().toEqualTypeOf<ToolchainFeatures | undefined>();
    });
  });

  it("is not assignable from an empty object (many required properties)", () => {
    expectTypeOf<{}>().not.toExtend<Toolchain>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Toolchain>().toEqualTypeOf<
      | "name"
      | "runtime"
      | "detect"
      | "resolve"
      | "compile"
      | "execute"
      | "test"
      | "package"
      | "packageManagers"
      | "resolvePackageManager"
      | "features"
    >();
  });
});
