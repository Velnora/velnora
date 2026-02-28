import { describe, expect, it } from "vitest";

import { UnitKind } from "@velnora/types";

import { defineUnit } from "./define-unit";

describe("defineUnit", () => {
  it("should return a function", () => {
    const define = defineUnit(UnitKind.RUNTIME);
    expect(typeof define).toBe("function");
  });

  it("should stamp kind onto a static object", () => {
    const define = defineUnit(UnitKind.RUNTIME);
    const result = define({ name: "node", version: "1.0.0" } as any);
    expect(result).toHaveProperty("kind", UnitKind.RUNTIME);
    expect(result).toHaveProperty("name", "node");
  });

  it("should wrap a factory function to inject kind", () => {
    const define = defineUnit(UnitKind.INTEGRATION);
    const factory = define((_env: any) => ({ name: "react", version: "1.0.0" }) as any);
    expect(typeof factory).toBe("function");

    const result = (factory as any)({ command: "dev", mode: "development" });
    expect(result).toHaveProperty("kind", UnitKind.INTEGRATION);
    expect(result).toHaveProperty("name", "react");
  });

  it("should use different kinds for different calls", () => {
    const defineRuntime = defineUnit(UnitKind.RUNTIME);
    const defineAdapter = defineUnit(UnitKind.ADAPTER);

    const runtime = defineRuntime({ name: "node", version: "1.0.0" } as any);
    const adapter = defineAdapter({ name: "vite", version: "1.0.0" } as any);

    expect(runtime).toHaveProperty("kind", UnitKind.RUNTIME);
    expect(adapter).toHaveProperty("kind", UnitKind.ADAPTER);
  });
});
