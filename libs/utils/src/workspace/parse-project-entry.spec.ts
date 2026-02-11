import { readFile } from "node:fs/promises";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseProjectEntry } from "./parse-project-entry";

vi.mock("node:fs/promises");

describe("parseProjectEntry", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should parse a valid package.json", async () => {
    const mockPath = "/root/packages/app/package.json";
    const mockConfig = { name: "my-app", version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockConfig));

    const result = await parseProjectEntry(mockPath);

    expect(result).toEqual({
      name: "my-app",
      root: "/root/packages/app",
      configFile: mockPath,
      config: mockConfig
    });
  });

  it("should return null if name is missing", async () => {
    const mockPath = "/root/packages/unnamed-lib/package.json";
    const mockConfig = { version: "1.0.0" };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockConfig));

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await parseProjectEntry(mockPath);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Missing 'name' in config file"));

    consoleSpy.mockRestore();
  });

  it("should return null if file read fails", async () => {
    const mockPath = "/root/packages/missing/package.json";

    vi.mocked(readFile).mockRejectedValue(new Error("File not found"));

    // Suppress console.warn for this test
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
