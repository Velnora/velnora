import { describe, expect, it, vi } from "vitest";

import { UnitKind } from "@velnora/types";
import type { ConfigEnv } from "@velnora/types";

import { defineRuntime } from "./define-runtime";

const createMinimalUnit = (overrides = {}) => ({
  name: "node",
  version: "1.0.0",
  runtime: "typescript",
  required: ["typescript"] as const,
  optional: [] as const,
  detect: vi.fn(),
  resolve: vi.fn(),
  compile: vi.fn(),
  execute: vi.fn(),
  test: vi.fn(),
  package: vi.fn(),
  packageManagers: [],
  resolvePackageManager: vi.fn(),
  ...overrides
});

describe("defineRuntime", () => {
  describe("static object form", () => {
    it("should add kind: UnitKind.RUNTIME to the returned object", () => {
      const unit = createMinimalUnit();
      const result = defineRuntime(unit);

      expect(result).toHaveProperty("kind", UnitKind.RUNTIME);
    });

    it("should have kind equal to 'runtime'", () => {
      const unit = createMinimalUnit();
      const result = defineRuntime(unit);

      expect(result.kind).toBe("runtime");
    });

    it("should preserve all other properties", () => {
      const unit = createMinimalUnit({
        name: "jvm",
        version: "2.5.0",
        runtime: "kotlin"
      });
      const result = defineRuntime(unit);

      expect(result.name).toBe("jvm");
      expect(result.version).toBe("2.5.0");
      expect(result.runtime).toBe("kotlin");
      expect(result.required).toEqual(["typescript"]);
      expect(result.optional).toEqual([]);
      expect(result.packageManagers).toEqual([]);
      expect(result.detect).toBe(unit.detect);
      expect(result.resolve).toBe(unit.resolve);
      expect(result.compile).toBe(unit.compile);
      expect(result.execute).toBe(unit.execute);
      expect(result.test).toBe(unit.test);
      expect(result.package).toBe(unit.package);
      expect(result.resolvePackageManager).toBe(unit.resolvePackageManager);
    });
  });

  describe("factory function form", () => {
    it("should return a function when given a function", () => {
      const factory = (_env: ConfigEnv) => createMinimalUnit();
      const result = defineRuntime(factory);

      expect(typeof result).toBe("function");
    });

    it("should return a RuntimeUnit with kind when the returned function is called", () => {
      const factory = (_env: ConfigEnv) => createMinimalUnit();
      const result = defineRuntime(factory);

      const env: ConfigEnv = { command: "build", mode: "production" };
      const unit = (result as (env: ConfigEnv) => ReturnType<typeof createMinimalUnit> & { kind: UnitKind })(env);

      expect(unit).toHaveProperty("kind", UnitKind.RUNTIME);
      expect(unit.kind).toBe("runtime");
      expect(unit.name).toBe("node");
      expect(unit.version).toBe("1.0.0");
    });

    it("should pass the env through to the inner function", () => {
      const factory = vi.fn((env: ConfigEnv) =>
        createMinimalUnit({
          name: env.command === "build" ? "node-prod" : "node-dev",
          version: env.mode === "production" ? "1.0.0" : "0.0.0-dev"
        })
      );

      const result = defineRuntime(factory);

      const env: ConfigEnv = { command: "build", mode: "production" };
      const unit = (result as (env: ConfigEnv) => ReturnType<typeof createMinimalUnit> & { kind: UnitKind })(env);

      expect(factory).toHaveBeenCalledWith(env);
      expect(factory).toHaveBeenCalledTimes(1);
      expect(unit.name).toBe("node-prod");
      expect(unit.version).toBe("1.0.0");
    });

    it("should add kind: UnitKind.RUNTIME to the result", () => {
      const factory = (_env: ConfigEnv) => createMinimalUnit();
      const wrapped = defineRuntime(factory);

      const serveEnv: ConfigEnv = { command: "serve", mode: "development" };
      const unit = (wrapped as (env: ConfigEnv) => ReturnType<typeof createMinimalUnit> & { kind: UnitKind })(serveEnv);

      expect(unit.kind).toBe(UnitKind.RUNTIME);
    });
  });

  describe("edge cases", () => {
    it("should work with empty required and optional arrays", () => {
      const unit = createMinimalUnit({
        required: [] as const,
        optional: [] as const
      });
      const result = defineRuntime(unit);

      expect(result.kind).toBe(UnitKind.RUNTIME);
      expect(result.required).toEqual([]);
      expect(result.optional).toEqual([]);
    });

    it("should preserve capabilities array if provided", () => {
      const capabilities = ["ssr", "hmr", "code-splitting"];
      const unit = createMinimalUnit({ capabilities });
      const result = defineRuntime(unit);

      expect(result.kind).toBe(UnitKind.RUNTIME);
      expect(result.capabilities).toEqual(["ssr", "hmr", "code-splitting"]);
    });

    it("should preserve capabilities in factory form", () => {
      const capabilities = ["streaming", "incremental-builds"];
      const factory = (_env: ConfigEnv) => createMinimalUnit({ capabilities });
      const wrapped = defineRuntime(factory);

      const env: ConfigEnv = { command: "serve", mode: "development" };
      const unit = (wrapped as (env: ConfigEnv) => ReturnType<typeof createMinimalUnit> & { kind: UnitKind })(env);

      expect(unit.kind).toBe(UnitKind.RUNTIME);
      expect(unit.capabilities).toEqual(["streaming", "incremental-builds"]);
    });
  });
});
