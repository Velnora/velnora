import { access, readFile } from "node:fs/promises";

import destr from "destr";
import { createJiti } from "jiti";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseConfig } from "./parse-config";

// Mock dependencies
vi.mock("node:fs/promises", () => ({
  access: vi.fn(),
  readFile: vi.fn()
}));
vi.mock("jiti", () => ({
  createJiti: vi.fn()
}));
vi.mock("destr", () => ({
  default: vi.fn()
}));

const mockAccess = vi.mocked(access);
const mockReadFile = vi.mocked(readFile);
const mockCreateJiti = vi.mocked(createJiti);
const mockDestr = vi.mocked(destr);

const PROJECT_ROOT = "/workspace/apps/my-app";

describe("parseConfig", () => {
  const mockJitiImport = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateJiti.mockReturnValue({ import: mockJitiImport } as unknown as ReturnType<typeof createJiti>);
  });

  it("should return {} when no config file is found", async () => {
    mockAccess.mockRejectedValue(new Error("ENOENT"));

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual({});
    expect(mockAccess).toHaveBeenCalledTimes(3);
  });

  it("should load .ts file via jiti when it exists", async () => {
    const config = { name: "my-app", client: { framework: "react" } };

    // access succeeds for the first candidate (velnora.config.ts)
    mockAccess.mockResolvedValueOnce(undefined);
    mockJitiImport.mockResolvedValueOnce(config);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual(config);
    expect(mockJitiImport).toHaveBeenCalledWith(`${PROJECT_ROOT}/velnora.config.ts`, { default: true });
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("should load .json file via readFile + destr when .ts and .js don't exist", async () => {
    const config = { name: "json-app" };

    // .ts and .js don't exist
    mockAccess.mockRejectedValueOnce(new Error("ENOENT"));
    mockAccess.mockRejectedValueOnce(new Error("ENOENT"));
    // .json exists
    mockAccess.mockResolvedValueOnce(undefined);

    mockReadFile.mockResolvedValueOnce('{"name":"json-app"}' as never);
    mockDestr.mockReturnValueOnce(config as never);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual(config);
    expect(mockReadFile).toHaveBeenCalledWith(`${PROJECT_ROOT}/velnora.config.json`, "utf-8");
    expect(mockDestr).toHaveBeenCalledWith('{"name":"json-app"}');
    expect(mockJitiImport).not.toHaveBeenCalled();
  });

  it("should return the first config found (.ts takes precedence over .js)", async () => {
    const tsConfig = { name: "from-ts" };

    // .ts exists
    mockAccess.mockResolvedValueOnce(undefined);
    mockJitiImport.mockResolvedValueOnce(tsConfig);

    const result = await parseConfig(PROJECT_ROOT);

    expect(result).toEqual(tsConfig);
    // access should only be called once since .ts was found immediately
    expect(mockAccess).toHaveBeenCalledTimes(1);
    expect(mockAccess).toHaveBeenCalledWith(`${PROJECT_ROOT}/velnora.config.ts`);
  });

  it("should use destr for JSON parsing", async () => {
    const rawJson = '{"name":"destr-test","client":{"framework":"react"}}';
    const parsedConfig = { name: "destr-test", client: { framework: "react" } };

    // .ts and .js don't exist
    mockAccess.mockRejectedValueOnce(new Error("ENOENT"));
    mockAccess.mockRejectedValueOnce(new Error("ENOENT"));
    // .json exists
    mockAccess.mockResolvedValueOnce(undefined);

    mockReadFile.mockResolvedValueOnce(rawJson as never);
    mockDestr.mockReturnValueOnce(parsedConfig as never);

    await parseConfig(PROJECT_ROOT);

    expect(mockDestr).toHaveBeenCalledOnce();
    expect(mockDestr).toHaveBeenCalledWith(rawJson);
  });
});
