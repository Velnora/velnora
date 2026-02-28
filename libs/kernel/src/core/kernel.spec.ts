/**
 * Unit tests for the {@link Kernel} class.
 *
 * All external dependencies (`@velnora/utils`, `@velnora/host`) are fully
 * mocked so that tests exercise only the Kernel's orchestration logic:
 *   - `init()` — workspace detection, project discovery, and `process.chdir`
 *   - `bootHost()` — Host instantiation, option forwarding, and guard clause
 *   - `shutdown()` — graceful close and idempotent re-shutdown
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Host } from "@velnora/host";
import type { Project } from "@velnora/types";
import { detectProjects, detectWorkspace } from "@velnora/utils";

import { Kernel } from "./kernel";

vi.mock("@velnora/utils", () => ({
  detectWorkspace: vi.fn(),
  detectProjects: vi.fn()
}));

vi.mock("@velnora/host", () => ({
  Host: vi.fn()
}));

const mockDetectWorkspace = vi.mocked(detectWorkspace);
const mockDetectProjects = vi.mocked(detectProjects);
const MockHost = vi.mocked(Host);

const fakeProject: Project = {
  name: "apps/web",
  displayName: "@test/web",
  root: "/workspace/apps/web",
  path: "/@test/web",
  packageJson: { name: "@test/web" },
  config: {}
};

describe("Kernel", () => {
  let kernel: Kernel;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(process, "chdir").mockImplementation(() => {});

    kernel = new Kernel();

    mockDetectWorkspace.mockResolvedValue({
      root: "/workspace",
      rootPackageJson: { workspaces: ["apps/*"] }
    });

    mockDetectProjects.mockResolvedValue([fakeProject]);
  });

  describe("init", () => {
    it("should detect workspace and discover projects", async () => {
      await kernel.init();

      expect(mockDetectWorkspace).toHaveBeenCalledWith(process.cwd());
      expect(mockDetectProjects).toHaveBeenCalledWith({ workspaces: ["apps/*"] });
    });

    it("should expose workspace root after init", async () => {
      await kernel.init();

      expect(kernel.workspaceRoot).toBe("/workspace");
    });

    it("should expose discovered projects after init", async () => {
      await kernel.init();

      expect(kernel.discoveredProjects).toHaveLength(1);
      expect(kernel.discoveredProjects[0]).toEqual(fakeProject);
    });
  });

  describe("bootHost", () => {
    it("should throw if no projects discovered", async () => {
      await expect(kernel.boot()).rejects.toThrow(/No projects discovered/);
    });

    it("should create Host and listen after init", async () => {
      const mockListen = vi.fn().mockResolvedValue({ url: "http://localhost:3000" });
      const mockClose = vi.fn();

      MockHost.mockImplementation(function () {
        return { listen: mockListen, close: mockClose } as any;
      });

      await kernel.init();
      await kernel.boot();

      expect(MockHost).toHaveBeenCalledWith([fakeProject], undefined);
      expect(mockListen).toHaveBeenCalled();
    });

    it("should pass options to Host", async () => {
      const mockListen = vi.fn().mockResolvedValue({ url: "http://localhost:4000" });

      MockHost.mockImplementation(function () {
        return { listen: mockListen, close: vi.fn() } as any;
      });

      const options = { port: 4000, host: "0.0.0.0" };

      await kernel.init();
      await kernel.boot(options);

      expect(MockHost).toHaveBeenCalledWith([fakeProject], options);
    });
  });

  describe("shutdown", () => {
    it("should do nothing if host not booted", async () => {
      // Should not throw
      await kernel.shutdown();
    });

    it("should close host when booted", async () => {
      const mockClose = vi.fn().mockResolvedValue(undefined);

      MockHost.mockImplementation(function () {
        return {
          listen: vi.fn().mockResolvedValue({ url: "http://localhost:3000" }),
          close: mockClose
        } as any;
      });

      await kernel.init();
      await kernel.boot();
      await kernel.shutdown();

      expect(mockClose).toHaveBeenCalled();
    });

    it("should nullify host after shutdown", async () => {
      const mockClose = vi.fn().mockResolvedValue(undefined);

      MockHost.mockImplementation(function () {
        return {
          listen: vi.fn().mockResolvedValue({ url: "http://localhost:3000" }),
          close: mockClose
        } as any;
      });

      await kernel.init();
      await kernel.boot();
      await kernel.shutdown();

      // Second shutdown should be a no-op
      await kernel.shutdown();
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });
});
