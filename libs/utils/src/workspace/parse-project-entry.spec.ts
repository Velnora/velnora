import { access, readFile } from "node:fs/promises";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { Project } from "../project";
import { parseProjectEntry } from "./parse-project-entry";

vi.mock("node:fs/promises");

describe("parseProjectEntry", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Workspace root is always process.cwd()
    vi.spyOn(process, "cwd").mockReturnValue("/root");

    // By default, no velnora.config.* files exist
    vi.mocked(access).mockRejectedValue(new Error("ENOENT"));
  });

  it("should parse a valid package.json with path-based name", async () => {
    const mockPath = "/root/packages/app/package.json";
    const mockPkg = { name: "@scope/my-app", version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPkg));

    const result = await parseProjectEntry(mockPath);

    expect(result).toBeInstanceOf(Project);
    expect(result!.name).toBe("packages/app");
    expect(result!.displayName).toBe("@scope/my-app");
    expect(result!.root).toBe("/root/packages/app");
    expect(result!.path).toBe("/@scope/my-app");
    expect(result!.packageJson).toEqual(mockPkg);
    expect(result!.config).toEqual({});
  });

  it("should return null if name is missing", async () => {
    const mockPath = "/root/packages/unnamed-lib/package.json";
    const mockPkg = { version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPkg));

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('missing "name" in package.json'));

    consoleSpy.mockRestore();
  });

  it("should return null if file read fails", async () => {
    const mockPath = "/root/packages/missing/package.json";

    vi.mocked(readFile).mockRejectedValue(new Error("File not found"));

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should return null if JSON parse fails", async () => {
    const mockPath = "/root/packages/invalid/package.json";

    vi.mocked(readFile).mockResolvedValue("invalid json");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
