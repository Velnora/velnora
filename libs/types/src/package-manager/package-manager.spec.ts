import { describe, expectTypeOf, it } from "vitest";

import type { Artifact } from "../utils";
import type { AddOptions } from "./add-options";
import type { AuditResult } from "./audit-result";
import type { Dependency } from "./dependency";
import type { DependencyTree } from "./dependency-tree";
import type { InstallOptions } from "./install-options";
import type { OutdatedResult } from "./outdated-result";
import type { PackageManager } from "./package-manager";

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
      expectTypeOf<PackageManager["publish"]>().toEqualTypeOf<((artifact: Artifact) => Promise<void>) | undefined>();
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
