import { describe, expect, it } from "vitest";

import { getPkgName } from "./get-pkg-name";

describe("getPkgName", () => {
  it("should return 'velnora' when no name is provided", () => {
    expect(getPkgName()).toBe("velnora");
  });

  it("should return 'velnora' when name is undefined", () => {
    expect(getPkgName(undefined)).toBe("velnora");
  });

  it("should return name as-is when it starts with 'velnora'", () => {
    expect(getPkgName("velnora")).toBe("velnora");
  });

  it("should return name as-is when it starts with 'velnora.'", () => {
    expect(getPkgName("velnora.kernel")).toBe("velnora.kernel");
  });

  it("should prefix name with 'velnora.' when it does not start with velnora", () => {
    expect(getPkgName("kernel")).toBe("velnora.kernel");
  });

  it("should prefix arbitrary names", () => {
    expect(getPkgName("cli-helper")).toBe("velnora.cli-helper");
  });
});
