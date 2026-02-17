/**
 * Unit tests for {@link resolveStaticFile}.
 *
 * Validates path stripping, `index.html` fallback for bare paths,
 * and `null` return when the file does not exist on disk.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolveStaticFile } from "./resolve-static-file";

vi.mock("node:fs", () => ({
  existsSync: vi.fn()
}));

const mockExistsSync = vi.mocked(existsSync);

const project = {
  name: "packages/app-one",
  displayName: "@example/app-one",
  root: "/workspace/packages/app-one",
  path: "/@example/app-one",
  packageJson: { name: "@example/app-one" },
  config: {}
};

describe("resolveStaticFile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should resolve a CSS file under the project src directory", () => {
    mockExistsSync.mockReturnValue(true);

    const result = resolveStaticFile(project, "/@example/app-one/style.css");

    expect(result).toBe(resolve("/workspace/packages/app-one", "src", "style.css"));
    expect(mockExistsSync).toHaveBeenCalledWith(result);
  });

  it("should resolve nested paths", () => {
    mockExistsSync.mockReturnValue(true);

    const result = resolveStaticFile(project, "/@example/app-one/assets/logo.png");

    expect(result).toBe(resolve("/workspace/packages/app-one", "src", "assets/logo.png"));
  });

  it("should fall back to index.html for bare project path", () => {
    mockExistsSync.mockReturnValue(true);

    const result = resolveStaticFile(project, "/@example/app-one");

    expect(result).toBe(resolve("/workspace/packages/app-one", "src", "index.html"));
  });

  it("should fall back to index.html for project path with trailing slash", () => {
    mockExistsSync.mockReturnValue(true);

    const result = resolveStaticFile(project, "/@example/app-one/");

    expect(result).toBe(resolve("/workspace/packages/app-one", "src", "index.html"));
  });

  it("should return null when the file does not exist", () => {
    mockExistsSync.mockReturnValue(false);

    const result = resolveStaticFile(project, "/@example/app-one/missing.txt");

    expect(result).toBeNull();
  });
});
