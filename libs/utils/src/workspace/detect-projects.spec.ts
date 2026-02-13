import { readFile } from "node:fs/promises";

import fg from "fast-glob";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { detectProjects } from "./detect-projects";
import { parseProjectEntry } from "./parse-project-entry";

vi.mock("fast-glob");
vi.mock("node:fs/promises");
vi.mock("./parse-project-entry", () => ({
  parseProjectEntry: vi.fn()
}));

const mockFg = vi.mocked(fg);
const mockReadFile = vi.mocked(readFile);
const mockParseProjectEntry = vi.mocked(parseProjectEntry);

describe("detectProjects", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should use workspaces from package.json and ignores from .gitignore", async () => {
    const rootPkgJson = { workspaces: ["packages/*", "libs/**"] };

    mockReadFile.mockResolvedValue("node_modules\ntemp/\n");
    mockFg.mockResolvedValue(["/root/packages/a/package.json"]);
    mockParseProjectEntry.mockResolvedValue({
      name: "packages/a",
      displayName: "pkg-name",
      root: "/root/packages/a",
      packageJson: { name: "pkg-name" },
      config: {}
    });

    const projects = await detectProjects(rootPkgJson);

    expect(mockFg).toHaveBeenCalledWith(
      ["packages/*/package.json", "libs/**/package.json"],
      expect.objectContaining({
        absolute: true,
        ignore: expect.arrayContaining(["node_modules", "temp/", "**/dist/**", "**/build/**", "**/.git/**"])
      })
    );

    expect(projects).toHaveLength(1);
    expect(projects[0]?.displayName).toBe("pkg-name");
  });

  it("should handle missing .gitignore and use defaults", async () => {
    const rootPkgJson = { workspaces: ["packages/*"] };

    mockReadFile.mockRejectedValue(new Error("no file"));
    mockFg.mockResolvedValue([]);

    await detectProjects(rootPkgJson);

    expect(mockFg).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ignore: expect.arrayContaining(["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"])
      })
    );
  });

  it("should return empty array if no workspaces defined", async () => {
    const rootPkgJson = {};

    const projects = await detectProjects(rootPkgJson);
    expect(projects).toEqual([]);
    expect(mockFg).not.toHaveBeenCalled();
  });
});
