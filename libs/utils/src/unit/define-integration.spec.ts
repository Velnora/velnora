import { describe, expect, it, vi } from "vitest";

import { UnitKind } from "@velnora/types";
import type { ConfigEnv } from "@velnora/types";

import { defineIntegration } from "./define-integration";

const createMinimalIntegration = (overrides = {}) => ({
  name: "react",
  version: "1.0.0",
  required: [] as const,
  optional: [] as const,
  ...overrides
});

describe("defineIntegration", () => {
  describe("static object form", () => {
    it("should add kind: UnitKind.INTEGRATION to the returned object", () => {
      const unit = createMinimalIntegration();
      const result = defineIntegration(unit);

      expect(result).toHaveProperty("kind", UnitKind.INTEGRATION);
    });

    it("should have kind equal to 'integration'", () => {
      const unit = createMinimalIntegration();
      const result = defineIntegration(unit);

      expect(result.kind).toBe("integration");
    });

    it("should preserve all other properties", () => {
      const configure = vi.fn();
      const build = vi.fn();
      const unit = createMinimalIntegration({
        name: "vue",
        version: "2.0.0",
        configure,
        build
      });
      const result = defineIntegration(unit);

      expect(result.name).toBe("vue");
      expect(result.version).toBe("2.0.0");
      expect(result.required).toEqual([]);
      expect(result.optional).toEqual([]);
      expect(result.configure).toBe(configure);
      expect(result.build).toBe(build);
    });
  });

  describe("factory function form", () => {
    it("should return a function when given a function", () => {
      const factory = (_env: ConfigEnv) => createMinimalIntegration();
      const result = defineIntegration(factory);

      expect(typeof result).toBe("function");
    });

    it("should return an IntegrationUnit with kind when the returned function is called", () => {
      const factory = (_env: ConfigEnv) => createMinimalIntegration();
      const result = defineIntegration(factory);

      const env: ConfigEnv = { command: "build", mode: "production" };
      const unit = (result as (env: ConfigEnv) => ReturnType<typeof createMinimalIntegration> & { kind: string })(env);

      expect(unit).toHaveProperty("kind", UnitKind.INTEGRATION);
      expect(unit.kind).toBe("integration");
      expect(unit.name).toBe("react");
    });

    it("should pass the env through to the inner function", () => {
      const factory = vi.fn((env: ConfigEnv) =>
        createMinimalIntegration({
          name: env.mode === "production" ? "react-prod" : "react-dev"
        })
      );

      const result = defineIntegration(factory);

      const env: ConfigEnv = { command: "build", mode: "production" };
      const unit = (result as (env: ConfigEnv) => ReturnType<typeof createMinimalIntegration> & { kind: string })(env);

      expect(factory).toHaveBeenCalledWith(env);
      expect(factory).toHaveBeenCalledTimes(1);
      expect(unit.name).toBe("react-prod");
    });
  });

  describe("edge cases", () => {
    it("should work with lifecycle hooks in static form", () => {
      const configure = vi.fn();
      const unit = createMinimalIntegration({ configure });
      const result = defineIntegration(unit);

      expect(result.kind).toBe(UnitKind.INTEGRATION);
      expect(result.configure).toBe(configure);
    });

    it("should preserve capabilities array if provided", () => {
      const capabilities = ["ssr", "streaming"];
      const unit = createMinimalIntegration({ capabilities });
      const result = defineIntegration(unit);

      expect(result.kind).toBe(UnitKind.INTEGRATION);
      expect(result.capabilities).toEqual(["ssr", "streaming"]);
    });
  });
});
