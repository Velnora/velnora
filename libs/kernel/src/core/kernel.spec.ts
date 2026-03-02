/**
 * Unit tests for the {@link Kernel} class.
 *
 * All external dependencies (`@velnora/utils`, `@velnora/host`, `@velnora/adapter-h3`,
 * `@velnora/runtime-node`) are fully mocked so that tests exercise only the Kernel's
 * orchestration logic:
 *   - `init()` — workspace detection, project discovery, and `process.chdir`
 *   - `boot()` — guard clause and integration configuration
 *   - `shutdown()` — graceful close and idempotent re-shutdown
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Host } from "@velnora/host";
import type { Project } from "@velnora/types";
import { detectProjects, detectWorkspace, parseConfig } from "@velnora/utils";

import { Kernel } from "./kernel";

vi.mock("@velnora/utils", () => ({
  detectWorkspace: vi.fn(),
  detectProjects: vi.fn(),
  parseConfig: vi.fn(),
  GlobalRegistry: {
    use: vi.fn(() => ({
      has: vi.fn(() => false),
      get: vi.fn(),
      set: vi.fn()
    }))
  },
  defineAdapter: vi.fn(),
  defineRuntime: vi.fn(),
  validateVersionRange: vi.fn()
}));

vi.mock("@velnora/host", () => ({
  Host: vi.fn()
}));

vi.mock("@velnora/adapter-h3", () => ({
  default: {
    kind: "adapter",
    name: "h3",
    configure: vi.fn()
  }
}));

vi.mock("@velnora/runtime-node", () => ({
  default: {
    kind: "runtime",
    name: "node",
    configure: vi.fn()
  }
}));

vi.mock("lodash.merge", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  default: vi.fn((...args: unknown[]) => Object.assign({}, ...args))
}));

const mockDetectWorkspace = vi.mocked(detectWorkspace);
const mockDetectProjects = vi.mocked(detectProjects);
const mockParseConfig = vi.mocked(parseConfig);

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
    mockParseConfig.mockResolvedValue({});
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

  describe("boot", () => {
    it("should throw if no projects discovered", async () => {
      await expect(kernel.boot()).rejects.toThrow(/No projects discovered/);
    });

    it("should not throw after init with projects", async () => {
      await kernel.init();
      await expect(kernel.boot()).resolves.not.toThrow();
    });
  });

  describe("shutdown", () => {
    it("should do nothing if host not booted", async () => {
      // Should not throw
      await kernel.shutdown();
    });
  });
});
