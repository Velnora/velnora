import { describe, expect, it } from "vitest";

import { validateVersionRange } from "./validate-version-range";

describe("validateVersionRange", () => {
  it("should return true for a valid version matching a range", () => {
    expect(validateVersionRange("22.0.0", ">=22")).toBe(true);
  });

  it("should return true for exact version match", () => {
    expect(validateVersionRange("18.0.0", "18.0.0")).toBe(true);
  });

  it("should handle v-prefixed versions", () => {
    expect(validateVersionRange("v22.0.0", ">=22")).toBe(true);
  });

  it("should return false for invalid version strings", () => {
    expect(validateVersionRange("not-a-version", ">=22")).toBe(false);
  });

  it("should return false for invalid range strings", () => {
    expect(validateVersionRange("22.0.0", "not-a-range")).toBe(false);
  });
});
