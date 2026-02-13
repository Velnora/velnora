import { access, readFile } from "node:fs/promises";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseProjectEntry } from "./parse-project-entry";

vi.mock("node:fs/promises");

const WORKSPACE_ROOT = "/root";

describe("parseProjectEntry", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // By default, no velnora.config.* files exist
    vi.mocked(access).mockRejectedValue(new Error("ENOENT"));
  });

  it("should parse a valid package.json with path-based name", async () => {
    const mockPath = "/root/packages/app/package.json";
    const mockPkg = { name: "@scope/my-app", version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPkg));

    const result = await parseProjectEntry(mockPath, WORKSPACE_ROOT);

    expect(result).toEqual({
      name: "packages/app",
      displayName: "@scope/my-app",
      root: "/root/packages/app",
      packageJson: mockPkg,
      config: {}
    });
  });

  it("should return null if name is missing", async () => {
    const mockPath = "/root/packages/unnamed-lib/package.json";
    const mockPkg = { version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPkg));

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath, WORKSPACE_ROOT);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('missing "name" in package.json'));

    consoleSpy.mockRestore();
  });

  it("should return null if file read fails", async () => {
    const mockPath = "/root/packages/missing/package.json";

    vi.mocked(readFile).mockRejectedValue(new Error("File not found"));

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath, WORKSPACE_ROOT);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should return null if JSON parse fails", async () => {
    const mockPath = "/root/packages/invalid/package.json";

    vi.mocked(readFile).mockResolvedValue("invalid json");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath, WORKSPACE_ROOT);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
