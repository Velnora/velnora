import { describe, expect, it } from "vitest";

import { defineConfig } from "./main";

describe("defineConfig (VelnoraConfig)", () => {
  it("should return the same config object", () => {
    const config = { apps: [] };
    expect(defineConfig(config as any)).toBe(config);
  });

  it("should preserve all properties", () => {
    const config = { apps: [], environment: { mode: "development" } };
    const result = defineConfig(config as any);
    expect(result).toEqual(config);
  });
});
