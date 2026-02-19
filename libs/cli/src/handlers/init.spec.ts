import { dirname } from "node:path";

import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { handleInit } from "./init";

vi.mock("@velnora/generator", () => ({
  initWorkspace: vi.fn()
}));

describe("handleInit", () => {
  let consoleInfoSpy: MockInstance;

  beforeEach(() => {
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call initWorkspace with the provided cwd", async () => {
    const { initWorkspace } = await import("@velnora/generator");
    const mockInitWorkspace = vi.mocked(initWorkspace);

    mockInitWorkspace.mockReturnValue({
      configPath: "/my/project/velnora.config.ts",
      packageJsonPath: "/my/project/package.json",
      status: "created"
    });

    handleInit("/my/project");

    expect(mockInitWorkspace).toHaveBeenCalledWith("/my/project");
  });

  it("should log 'Initialized workspace' when status is created", async () => {
    const { initWorkspace } = await import("@velnora/generator");
    const mockInitWorkspace = vi.mocked(initWorkspace);

    mockInitWorkspace.mockReturnValue({
      configPath: "/workspace/velnora.config.ts",
      packageJsonPath: "/workspace/package.json",
      status: "created"
    });

    handleInit("/workspace");

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `[Velnora] Initialized workspace: ${dirname("/workspace/velnora.config.ts")}`
    );
  });

  it("should log 'Already initialized' when status is exists", async () => {
    const { initWorkspace } = await import("@velnora/generator");
    const mockInitWorkspace = vi.mocked(initWorkspace);

    mockInitWorkspace.mockReturnValue({
      configPath: "/workspace/velnora.config.ts",
      packageJsonPath: "/workspace/package.json",
      status: "exists"
    });

    handleInit("/workspace");

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `[Velnora] Already initialized: ${dirname("/workspace/velnora.config.ts")}`
    );
  });
});
