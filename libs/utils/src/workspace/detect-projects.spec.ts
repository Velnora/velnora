import { readFile } from "node:fs/promises";

import destr from "destr";
import fg from "fast-glob";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { detectProjects } from "./detect-projects";

vi.mock("fast-glob");
vi.mock("node:fs/promises");
vi.mock("destr");
vi.mock("node:path", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("node:path");
  return {
    ...actual,
    join: (a: string, b: string) => `${a}/${b}`
  };
});

const mockFg = vi.mocked(fg);
const mockReadFile = vi.mocked(readFile);
const mockDestr = vi.mocked(destr);

describe("findProjects", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should use workspaces from package.json and ignores from .gitignore", async () => {
    const root = "/root";
    const rootPkgJson = { workspaces: ["packages/*", "libs/**"] };

    mockReadFile.mockImplementation((path: unknown) => {
      const p = path as string;
      if (p === `/root/.gitignore`) {
        return Promise.resolve("node_modules\ntemp/\n");
      }
      return Promise.resolve(JSON.stringify({ name: "pkg-name" }));
    });

    mockDestr.mockImplementation((content: string) => JSON.parse(content));

    mockFg.mockResolvedValue(["/root/packages/a/package.json"]);

    const projects = await detectProjects(root, rootPkgJson);

    expect(mockFg).toHaveBeenCalledWith(
      ["packages/*/package.json", "libs/**/package.json"],
      expect.objectContaining({
        cwd: root,
        absolute: true,
        ignore: expect.arrayContaining(["node_modules", "temp/", "**/dist/**", "**/build/**", "**/.git/**"])
      })
    );

    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("pkg-name");
  });

  it("should handle missing .gitignore and use defaults", async () => {
    const root = "/root";
    const rootPkgJson = { workspaces: ["packages/*"] };

    mockReadFile.mockImplementation((path: unknown) => {
      const p = path as string;
      if (p === `/root/.gitignore`) return Promise.reject(new Error("no file"));
      return Promise.resolve(JSON.stringify({ name: "pkg" }));
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mockDestr.mockImplementation(c => JSON.parse(c));
    mockFg.mockResolvedValue([]);

    await detectProjects(root, rootPkgJson);

    expect(mockFg).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ignore: expect.arrayContaining(["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"])
      })
    );
  });

  it("should return empty array if no workspaces defined", async () => {
    const rootPkgJson = {};
    mockReadFile.mockResolvedValue("{}");
    mockDestr.mockReturnValue({});

    const projects = await detectProjects("/root", rootPkgJson);
    expect(projects).toEqual([]);
    expect(mockFg).not.toHaveBeenCalled();
  });
});
