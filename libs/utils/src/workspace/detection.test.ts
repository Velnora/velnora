import { readFileSync } from "node:fs";

import destr from "destr";
import { findUp } from "find-up";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { VELNORA_CONFIG_FILES, findWorkspaceRoot } from "./detection";

// Mock find-up and fs
vi.mock("find-up");
vi.mock("node:fs");
vi.mock("destr");

describe("findWorkspaceRoot", () => {
  const cwd = "/users/dev/project";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return directory containing velnora.config", async () => {
    // Mock findUp to return a config path
    vi.mocked(findUp).mockResolvedValueOnce("/users/dev/project/velnora.config.json");

    const result = await findWorkspaceRoot(cwd);
    expect(result).toBe("/users/dev/project");
    expect(findUp).toHaveBeenCalledWith(VELNORA_CONFIG_FILES, { cwd });
  });

  it("should return directory containing package.json with velnora property", async () => {
    // First call for config returns undefined
    vi.mocked(findUp).mockResolvedValueOnce(undefined);
    // Second call for package.json returns path
    vi.mocked(findUp).mockResolvedValueOnce("/users/dev/project/package.json");
    // Mock readFileSync
    vi.mocked(readFileSync).mockReturnValue('{"velnora":{}}');
    // Mock destr to return object
    vi.mocked(destr).mockReturnValue({ velnora: {} });

    const result = await findWorkspaceRoot(cwd);
    expect(result).toBe("/users/dev/project");
  });

  it("should ignore package.json without velnora property", async () => {
    vi.mocked(findUp).mockResolvedValueOnce(undefined);
    vi.mocked(findUp).mockResolvedValueOnce("/users/dev/project/package.json");
    vi.mocked(readFileSync).mockReturnValue('{"name":"my-pkg"}');
    vi.mocked(destr).mockReturnValue({ name: "my-pkg" });

    const result = await findWorkspaceRoot(cwd);
    expect(result).toBe(cwd); // Fallback to cwd
  });

  it("should ignore invalid package.json (mocked via destr behavior coverage, though destr is safe)", async () => {
    // Even if destr returns null/undefined/primitive, check our logic handles it
    vi.mocked(findUp).mockResolvedValueOnce(undefined);
    vi.mocked(findUp).mockResolvedValueOnce("/users/dev/project/package.json");
    vi.mocked(readFileSync).mockReturnValue("invalid");
    vi.mocked(destr).mockReturnValue(undefined); // destr handles invalid json by returning input or safe value

    const result = await findWorkspaceRoot(cwd);
    expect(result).toBe(cwd);
  });

  it("should fallback to cwd if nothing found", async () => {
    vi.mocked(findUp).mockResolvedValue(undefined);

    const result = await findWorkspaceRoot(cwd);
    expect(result).toBe(cwd);
  });
});
