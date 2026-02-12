import { readFileSync as readFileSyncSync } from "node:fs";

import destr from "destr";
import { findUp } from "find-up";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { detectWorkspace } from "./detect-workspace";

// Mock dependencies
vi.mock("find-up", () => ({
  findUp: vi.fn()
}));
vi.mock("node:fs");
vi.mock("destr");

const mockFindUp = vi.mocked(findUp);
const mockReadFileSync = vi.mocked(readFileSyncSync);
const mockDestr = vi.mocked(destr);

describe("findWorkspaceRoot", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should find workspace root if package.json has workspaces", async () => {
    // mockFindUp logic needs careful setup because findUp is called in a loop with DIFFERENT cwd.
    // The implementation passes specific `cwd` options.
    // However, `findUp` *finds* based on file system or mock.
    // The implementation does: `await findUp("package.json", { cwd: dir })`

    // Test 1: immediate find
    mockFindUp.mockImplementation(async (file, opts) => {
      // Satisfy async requirement with a dummy await if needed, or simply return a Promise
      await Promise.resolve();
      if (opts?.cwd === "/root") return "/root/package.json";
      return undefined;
    });

    mockReadFileSync.mockReturnValue(JSON.stringify({ workspaces: ["packages/*"] }));
    mockDestr.mockReturnValue({ workspaces: ["packages/*"] });

    const { root } = await detectWorkspace("/root");
    expect(root).toBe("/root");
  });

  it("should traverse up until it finds package.json with workspaces", async () => {
    // Level 1: /root/packages/app -> finds package.json (no workspaces)
    // Level 2: /root/packages -> finds package.json in /root (has workspaces)

    mockFindUp.mockImplementation(async (file, opts) => {
      await Promise.resolve();
      // First call: cwd = /root/packages/app
      if (opts?.cwd === "/root/packages/app") return "/root/packages/app/package.json";
      // Second call: cwd = /root/packages (parent of app package.json dir)
      if (opts?.cwd === "/root/packages") return "/root/package.json";
      // Third call: cwd = /root (parent of root package.json dir, if we continued)
      if (opts?.cwd === "/root") return "/root/package.json"; // Or undefined if we want to stop
      return undefined;
    });

    mockReadFileSync.mockImplementation((path: unknown) => {
      const p = path as string;
      if (p === "/root/packages/app/package.json") return JSON.stringify({ name: "app" });
      if (p === "/root/package.json") return JSON.stringify({ workspaces: ["packages/*"] });
      return "{}";
    });

    mockDestr.mockImplementation((content: string) => JSON.parse(content));

    const { root } = await detectWorkspace("/root/packages/app");
    expect(root).toBe("/root");
  });

  it("should throw error if no package.json with workspaces is found", async () => {
    mockFindUp.mockResolvedValue(undefined);
    await expect(detectWorkspace("/some/path")).rejects.toThrow(/No workspace root found/);
  });
});
