import { describe, expectTypeOf, it } from "vitest";

import type { Artifact } from "../utils/artifact";
import type { AddOptions } from "./add-options";
import type { AuditResult } from "./audit-result";
import type { DependencyScope } from "./depdendency-scope";
import type { Dependency } from "./dependency";
import type { DependencyTree } from "./dependency-tree";
import type { InstallOptions } from "./install-options";
import type { OutdatedResult } from "./outdated-result";
import type { PackageManager } from "./package-manager";
import type { ResolvedDependency } from "./resolved-dependency";
import type { Vulnerability } from "./vulnerability";

// ── DependencyScope ─────────────────────────────────────────────────────

describe("DependencyScope (type-level)", () => {
  it("accepts 'runtime'", () => {
    expectTypeOf<"runtime">().toExtend<DependencyScope>();
  });

  it("accepts 'dev'", () => {
    expectTypeOf<"dev">().toExtend<DependencyScope>();
  });

  it("accepts 'test'", () => {
    expectTypeOf<"test">().toExtend<DependencyScope>();
  });

  it("accepts 'provided'", () => {
    expectTypeOf<"provided">().toExtend<DependencyScope>();
  });

  it("is exactly the four-member union", () => {
    expectTypeOf<DependencyScope>().toEqualTypeOf<"runtime" | "dev" | "test" | "provided">();
  });

  it("does not accept arbitrary strings", () => {
    expectTypeOf<string>().not.toExtend<DependencyScope>();
  });
});

// ── AddOptions ──────────────────────────────────────────────────────────

describe("AddOptions interface (type-level)", () => {
  it("has an optional `scope` property typed as DependencyScope", () => {
    expectTypeOf<AddOptions["scope"]>().toEqualTypeOf<DependencyScope | undefined>();
  });

  it("has an optional `exact` property typed as boolean", () => {
    expectTypeOf<AddOptions["exact"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof AddOptions>().toEqualTypeOf<"scope" | "exact">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = { scope: DependencyScope; exact: boolean };
    expectTypeOf<Valid>().toExtend<AddOptions>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<AddOptions>();
  });

  it("is assignable from a partial object", () => {
    expectTypeOf<{ scope: "dev" }>().toExtend<AddOptions>();
    expectTypeOf<{ exact: true }>().toExtend<AddOptions>();
  });
});

// ── Vulnerability ───────────────────────────────────────────────────────

describe("Vulnerability interface (type-level)", () => {
  it("has a string `package` property", () => {
    expectTypeOf<Vulnerability["package"]>().toEqualTypeOf<string>();
  });

  it("has a `severity` property with the correct union type", () => {
    expectTypeOf<Vulnerability["severity"]>().toEqualTypeOf<"critical" | "high" | "moderate" | "low">();
  });

  it("has a string `description` property", () => {
    expectTypeOf<Vulnerability["description"]>().toEqualTypeOf<string>();
  });

  it("has an optional string `fixAvailable` property", () => {
    expectTypeOf<Vulnerability["fixAvailable"]>().toEqualTypeOf<string | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Vulnerability>().toEqualTypeOf<"package" | "severity" | "description" | "fixAvailable">();
  });

  it("is assignable from a valid object literal with all properties", () => {
    type Valid = {
      package: string;
      severity: "high";
      description: string;
      fixAvailable: string;
    };

    expectTypeOf<Valid>().toExtend<Vulnerability>();
  });

  it("is assignable from a valid object literal without optional properties", () => {
    type Valid = {
      package: string;
      severity: "critical";
      description: string;
    };

    expectTypeOf<Valid>().toExtend<Vulnerability>();
  });

  it("severity does not accept arbitrary strings", () => {
    expectTypeOf<string>().not.toExtend<Vulnerability["severity"]>();
  });
});

// ── AuditResult ─────────────────────────────────────────────────────────

describe("AuditResult interface (type-level)", () => {
  it("has a `vulnerabilities` property typed as Vulnerability[]", () => {
    expectTypeOf<AuditResult["vulnerabilities"]>().toEqualTypeOf<Vulnerability[]>();
  });

  it("has a `summary` property with the correct shape", () => {
    expectTypeOf<AuditResult["summary"]>().toEqualTypeOf<{
      critical: number;
      high: number;
      moderate: number;
      low: number;
    }>();
  });

  it("summary.critical is a number", () => {
    expectTypeOf<AuditResult["summary"]["critical"]>().toEqualTypeOf<number>();
  });

  it("summary.high is a number", () => {
    expectTypeOf<AuditResult["summary"]["high"]>().toEqualTypeOf<number>();
  });

  it("summary.moderate is a number", () => {
    expectTypeOf<AuditResult["summary"]["moderate"]>().toEqualTypeOf<number>();
  });

  it("summary.low is a number", () => {
    expectTypeOf<AuditResult["summary"]["low"]>().toEqualTypeOf<number>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof AuditResult>().toEqualTypeOf<"vulnerabilities" | "summary">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = {
      vulnerabilities: Vulnerability[];
      summary: { critical: number; high: number; moderate: number; low: number };
    };

    expectTypeOf<Valid>().toExtend<AuditResult>();
  });
});

// ── Dependency ──────────────────────────────────────────────────────────

describe("Dependency interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<Dependency["name"]>().toEqualTypeOf<string>();
  });

  it("has an optional string `version` property", () => {
    expectTypeOf<Dependency["version"]>().toEqualTypeOf<string | undefined>();
  });

  it("has an optional `scope` property typed as DependencyScope", () => {
    expectTypeOf<Dependency["scope"]>().toEqualTypeOf<DependencyScope | undefined>();
  });

  it("has an optional string `registry` property", () => {
    expectTypeOf<Dependency["registry"]>().toEqualTypeOf<string | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof Dependency>().toEqualTypeOf<"name" | "version" | "scope" | "registry">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
      registry: string;
    };

    expectTypeOf<Valid>().toExtend<Dependency>();
  });

  it("is assignable from a minimal object with only required properties", () => {
    expectTypeOf<{ name: string }>().toExtend<Dependency>();
  });

  it("is not assignable without the required `name` property", () => {
    expectTypeOf<{ version: string }>().not.toExtend<Dependency>();
  });
});

// ── ResolvedDependency ──────────────────────────────────────────────────

describe("ResolvedDependency interface (type-level)", () => {
  it("has a string `name` property", () => {
    expectTypeOf<ResolvedDependency["name"]>().toEqualTypeOf<string>();
  });

  it("has a string `version` property", () => {
    expectTypeOf<ResolvedDependency["version"]>().toEqualTypeOf<string>();
  });

  it("has a `scope` property typed as DependencyScope", () => {
    expectTypeOf<ResolvedDependency["scope"]>().toEqualTypeOf<DependencyScope>();
  });

  it("has an optional `children` property typed as ResolvedDependency[]", () => {
    expectTypeOf<ResolvedDependency["children"]>().toEqualTypeOf<ResolvedDependency[] | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof ResolvedDependency>().toEqualTypeOf<"name" | "version" | "scope" | "children">();
  });

  it("is assignable from a valid object literal with all properties", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
      children: ResolvedDependency[];
    };

    expectTypeOf<Valid>().toExtend<ResolvedDependency>();
  });

  it("is assignable from a valid object literal without optional children", () => {
    type Valid = {
      name: string;
      version: string;
      scope: DependencyScope;
    };

    expectTypeOf<Valid>().toExtend<ResolvedDependency>();
  });

  it("children elements are themselves ResolvedDependency", () => {
    type Child = NonNullable<ResolvedDependency["children"]>[number];
    expectTypeOf<Child>().toEqualTypeOf<ResolvedDependency>();
  });

  it("supports recursive nesting (children of children)", () => {
    type Child = NonNullable<ResolvedDependency["children"]>[number];
    type GrandChild = NonNullable<Child["children"]>[number];
    expectTypeOf<GrandChild>().toEqualTypeOf<ResolvedDependency>();
  });

  it("is not assignable without required `version` property", () => {
    expectTypeOf<{ name: string; scope: DependencyScope }>().not.toExtend<ResolvedDependency>();
  });

  it("is not assignable without required `scope` property", () => {
    expectTypeOf<{ name: string; version: string }>().not.toExtend<ResolvedDependency>();
  });
});

// ── DependencyTree ──────────────────────────────────────────────────────

describe("DependencyTree interface (type-level)", () => {
  it("has a `dependencies` property typed as ResolvedDependency[]", () => {
    expectTypeOf<DependencyTree["dependencies"]>().toEqualTypeOf<ResolvedDependency[]>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof DependencyTree>().toEqualTypeOf<"dependencies">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = { dependencies: ResolvedDependency[] };
    expectTypeOf<Valid>().toExtend<DependencyTree>();
  });

  it("is not assignable from an empty object", () => {
    expectTypeOf<{}>().not.toExtend<DependencyTree>();
  });
});

// ── InstallOptions ──────────────────────────────────────────────────────

describe("InstallOptions interface (type-level)", () => {
  it("has an optional boolean `frozen` property", () => {
    expectTypeOf<InstallOptions["frozen"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has an optional boolean `production` property", () => {
    expectTypeOf<InstallOptions["production"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof InstallOptions>().toEqualTypeOf<"frozen" | "production">();
  });

  it("is assignable from a full object literal", () => {
    type Valid = { frozen: boolean; production: boolean };
    expectTypeOf<Valid>().toExtend<InstallOptions>();
  });

  it("is assignable from an empty object (all properties optional)", () => {
    expectTypeOf<{}>().toExtend<InstallOptions>();
  });

  it("is assignable from a partial object", () => {
    expectTypeOf<{ frozen: true }>().toExtend<InstallOptions>();
    expectTypeOf<{ production: false }>().toExtend<InstallOptions>();
  });
});

// ── OutdatedResult ──────────────────────────────────────────────────────

describe("OutdatedResult interface (type-level)", () => {
  it("has a `packages` property typed as an array of package info objects", () => {
    expectTypeOf<OutdatedResult["packages"]>().toEqualTypeOf<
      { name: string; current: string; latest: string; wanted: string }[]
    >();
  });

  it("packages element has a string `name`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["name"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `current`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["current"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `latest`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["latest"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `wanted`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["wanted"]>().toEqualTypeOf<string>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof OutdatedResult>().toEqualTypeOf<"packages">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = {
      packages: { name: string; current: string; latest: string; wanted: string }[];
    };

    expectTypeOf<Valid>().toExtend<OutdatedResult>();
  });
});

// ── PackageManager ──────────────────────────────────────────────────────

describe("PackageManager interface (type-level)", () => {
  describe("required properties", () => {
    it("has a string `name` property", () => {
      expectTypeOf<PackageManager["name"]>().toEqualTypeOf<string>();
    });

    it("has a string `runtime` property", () => {
      expectTypeOf<PackageManager["runtime"]>().toEqualTypeOf<string>();
    });

    it("has a string `manifestName` property", () => {
      expectTypeOf<PackageManager["manifestName"]>().toEqualTypeOf<string>();
    });
  });

  describe("optional properties", () => {
    it("has an optional string `lockfileName` property", () => {
      expectTypeOf<PackageManager["lockfileName"]>().toEqualTypeOf<string | undefined>();
    });
  });

  describe("resolution methods", () => {
    it("detect accepts a string cwd and returns Promise<boolean>", () => {
      expectTypeOf<PackageManager["detect"]>().toEqualTypeOf<(cwd: string) => Promise<boolean>>();
    });

    it("resolveBinary returns Promise<string>", () => {
      expectTypeOf<PackageManager["resolveBinary"]>().toEqualTypeOf<() => Promise<string>>();
    });
  });

  describe("core operations (required)", () => {
    it("install accepts optional InstallOptions and returns Promise<void>", () => {
      expectTypeOf<PackageManager["install"]>().toEqualTypeOf<(opts?: InstallOptions) => Promise<void>>();
    });

    it("list returns Promise<DependencyTree>", () => {
      expectTypeOf<PackageManager["list"]>().toEqualTypeOf<() => Promise<DependencyTree>>();
    });
  });

  describe("mutation operations (optional)", () => {
    it("add is an optional method", () => {
      expectTypeOf<PackageManager["add"]>().toEqualTypeOf<
        ((deps: Dependency[], opts?: AddOptions) => Promise<void>) | undefined
      >();
    });

    it("remove is an optional method", () => {
      expectTypeOf<PackageManager["remove"]>().toEqualTypeOf<((deps: string[]) => Promise<void>) | undefined>();
    });
  });

  describe("analysis operations (optional)", () => {
    it("publish is an optional method accepting an Artifact", () => {
      expectTypeOf<PackageManager["publish"]>().toEqualTypeOf<
        ((artifact: Artifact) => Promise<void>) | undefined
      >();
    });

    it("audit is an optional method returning Promise<AuditResult>", () => {
      expectTypeOf<PackageManager["audit"]>().toEqualTypeOf<(() => Promise<AuditResult>) | undefined>();
    });

    it("outdated is an optional method returning Promise<OutdatedResult>", () => {
      expectTypeOf<PackageManager["outdated"]>().toEqualTypeOf<(() => Promise<OutdatedResult>) | undefined>();
    });
  });

  describe("keys", () => {
    it("has exactly the expected keys", () => {
      expectTypeOf<keyof PackageManager>().toEqualTypeOf<
        | "name"
        | "runtime"
        | "detect"
        | "resolveBinary"
        | "manifestName"
        | "lockfileName"
        | "install"
        | "list"
        | "add"
        | "remove"
        | "publish"
        | "audit"
        | "outdated"
      >();
    });
  });

  describe("assignability", () => {
    it("is assignable from a valid object with all required and optional members", () => {
      type Valid = {
        name: string;
        runtime: string;
        detect: (cwd: string) => Promise<boolean>;
        resolveBinary: () => Promise<string>;
        manifestName: string;
        lockfileName: string;
        install: (opts?: InstallOptions) => Promise<void>;
        list: () => Promise<DependencyTree>;
        add: (deps: Dependency[], opts?: AddOptions) => Promise<void>;
        remove: (deps: string[]) => Promise<void>;
        publish: (artifact: Artifact) => Promise<void>;
        audit: () => Promise<AuditResult>;
        outdated: () => Promise<OutdatedResult>;
      };

      expectTypeOf<Valid>().toExtend<PackageManager>();
    });

    it("is assignable from a valid object with only required members", () => {
      type Minimal = {
        name: string;
        runtime: string;
        detect: (cwd: string) => Promise<boolean>;
        resolveBinary: () => Promise<string>;
        manifestName: string;
        install: (opts?: InstallOptions) => Promise<void>;
        list: () => Promise<DependencyTree>;
      };

      expectTypeOf<Minimal>().toExtend<PackageManager>();
    });

    it("is not assignable without the required `install` method", () => {
      type MissingInstall = {
        name: string;
        runtime: string;
        detect: (cwd: string) => Promise<boolean>;
        resolveBinary: () => Promise<string>;
        manifestName: string;
        list: () => Promise<DependencyTree>;
      };

      expectTypeOf<MissingInstall>().not.toExtend<PackageManager>();
    });

    it("is not assignable without the required `detect` method", () => {
      type MissingDetect = {
        name: string;
        runtime: string;
        resolveBinary: () => Promise<string>;
        manifestName: string;
        install: (opts?: InstallOptions) => Promise<void>;
        list: () => Promise<DependencyTree>;
      };

      expectTypeOf<MissingDetect>().not.toExtend<PackageManager>();
    });
  });
});
