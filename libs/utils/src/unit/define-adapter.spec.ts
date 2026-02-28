import { describe, expect, it } from "vitest";

import { UnitKind } from "@velnora/types";

import { defineAdapter } from "./define-adapter";

describe("defineAdapter", () => {
  it("should add kind: ADAPTER to a static unit definition", () => {
    const unit = defineAdapter({ name: "vite", version: "1.0.0" } as any);
    expect(unit).toHaveProperty("kind", UnitKind.ADAPTER);
    expect(unit).toHaveProperty("name", "vite");
  });

  it("should return a factory when given a function", () => {
    const factory = defineAdapter((_env: any) => ({ name: "vite", version: "1.0.0" }) as any);
    expect(typeof factory).toBe("function");

    const result = (factory as any)({ command: "dev", mode: "development" });
    expect(result).toHaveProperty("kind", UnitKind.ADAPTER);
    expect(result).toHaveProperty("name", "vite");
  });
});
