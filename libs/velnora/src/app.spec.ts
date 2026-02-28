import { describe, expect, it } from "vitest";

import { defineConfig } from "./app";

describe("defineConfig (VelnoraAppConfig)", () => {
  it("should return the same config object", () => {
    const config = { name: "my-app" };
    expect(defineConfig(config)).toBe(config);
  });

  it("should preserve all properties", () => {
    const config = { name: "my-app", root: "/path/to/app" };
    const result = defineConfig(config);
    expect(result).toEqual(config);
  });
});
