import { describe, expect, it } from "vitest";

import { NpmPackageManager } from "./npm";

describe("NpmPackageManager", () => {
  it("should have correct name", () => {
    const pm = new NpmPackageManager();
    expect(pm.name).toBe("npm");
  });

  it("should have correct manifest name", () => {
    const pm = new NpmPackageManager();
    expect(pm.manifestName).toBe("package.json");
  });

  it("should have correct lockfile name", () => {
    const pm = new NpmPackageManager();
    expect(pm.lockfileName).toBe("package-lock.json");
  });

  it("should resolve install with undefined", async () => {
    const pm = new NpmPackageManager();
    const result = await pm.install();
    expect(result).toBeUndefined();
  });

  it("should resolve list with undefined", async () => {
    const pm = new NpmPackageManager();
    const result = await pm.list();
    expect(result).toBeUndefined();
  });
});
