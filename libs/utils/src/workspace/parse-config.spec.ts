import { access, readFile } from "node:fs/promises";

import destr from "destr";
import { glob } from "glob";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import the mocked jiti to get a handle on its .import method
import { jiti } from "../utils/jiti";
import { parseConfig } from "./parse-config";

// Mock dependencies
vi.mock("node:fs/promises", () => ({
  access: vi.fn(),
  readFile: vi.fn()
}));
vi.mock("glob", () => ({ glob: vi.fn() }));
vi.mock("../utils/jiti", () => ({ jiti: { import: vi.fn() } }));
vi.mock("destr", () => ({ default: vi.fn() }));

const mockAccess = vi.mocked(access);
const mockReadFile = vi.mocked(readFile);
const mockGlob = vi.mocked(glob);
const mockDestr = vi.mocked(destr);

const mockJitiImport = vi.mocked(jiti.import.bind(jiti));

const PROJECT_ROOT = "/workspace/apps/my-app";

describe("parseConfig", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return {} when no config file is found", async () => {
    mockGlob.mockResolvedValue([] as never);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual({});
    expect(mockGlob).toHaveBeenCalledWith(["velnora.config.ts", "velnora.config.js", "velnora.config.json"], {
      cwd: PROJECT_ROOT
    });
  });

  it("should load .ts file via jiti when it exists", async () => {
    const config = { name: "my-app", client: { framework: "react" } };

    mockGlob.mockResolvedValue(["velnora.config.ts"] as never);
    mockAccess.mockResolvedValueOnce(undefined);
    mockJitiImport.mockResolvedValueOnce(config as never);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual(config);
    expect(mockJitiImport).toHaveBeenCalledWith("velnora.config.ts", { default: true });
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("should load .json file via readFile + destr", async () => {
    const config = { name: "json-app" };

    mockGlob.mockResolvedValue(["velnora.config.json"] as never);
    mockAccess.mockResolvedValueOnce(undefined);

    mockReadFile.mockResolvedValueOnce('{"name":"json-app"}' as never);
    mockDestr.mockReturnValueOnce(config as never);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual(config);
    expect(mockReadFile).toHaveBeenCalledWith("velnora.config.json", "utf-8");
    expect(mockDestr).toHaveBeenCalledWith('{"name":"json-app"}');
    expect(mockJitiImport).not.toHaveBeenCalled();
  });

  it("should throw when multiple config files are found", async () => {
    mockGlob.mockResolvedValue(["velnora.config.ts", "velnora.config.js", "velnora.config.json"] as never);

    await expect(parseConfig(PROJECT_ROOT)).rejects.toThrow(/Multiple config files found/);
  });

  it("should use destr for JSON parsing", async () => {
    const rawJson = '{"name":"destr-test","client":{"framework":"react"}}';
    const parsedConfig = { name: "destr-test", client: { framework: "react" } };

    mockGlob.mockResolvedValue(["velnora.config.json"] as never);
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce(rawJson as never);
    mockDestr.mockReturnValueOnce(parsedConfig as never);

    await parseConfig(PROJECT_ROOT);

    expect(mockDestr).toHaveBeenCalledOnce();
    expect(mockDestr).toHaveBeenCalledWith(rawJson);
  });

  it("should return {} when access to config file fails", async () => {
    mockGlob.mockResolvedValue(["velnora.config.ts"] as never);
    mockAccess.mockRejectedValueOnce(new Error("ENOENT"));

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual({});
    expect(mockJitiImport).not.toHaveBeenCalled();
  });

  it("should return {} when jiti.import throws", async () => {
    mockGlob.mockResolvedValue(["velnora.config.ts"] as never);
    mockAccess.mockResolvedValueOnce(undefined);
    mockJitiImport.mockRejectedValueOnce(new Error("Syntax error") as never);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual({});
  });
});
