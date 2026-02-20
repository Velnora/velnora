/**
 * Unit tests for the {@link Host} class.
 *
 * File-system helpers, `resolveStaticFile`, and `listhen` are mocked.
 * `h3` is used with `importOriginal` so real routing works but we can
 * capture `serveStatic` calls. Tests invoke handlers via `toWebHandler`.
 */
import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { listen } from "listhen";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Project } from "@velnora/types";

import { resolveStaticFile } from "../utils/resolve-static-file";
import { Host } from "./host";

vi.mock("node:fs", () => ({
  statSync: vi.fn(),
  existsSync: vi.fn()
}));

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn()
}));

vi.mock("../utils/resolve-static-file", () => ({
  resolveStaticFile: vi.fn()
}));

const mockCloseFn = vi.fn();

vi.mock("listhen", () => ({
  listen: vi.fn().mockImplementation(() => Promise.resolve({ url: "http://localhost:3000", close: mockCloseFn }))
}));

const mockResolveStaticFile = vi.mocked(resolveStaticFile);
const mockStatSync = vi.mocked(statSync);
const mockReadFile = vi.mocked(readFile);
const mockListen = vi.mocked(listen);

const fakeProject: Project = {
  name: "packages/app-one",
  displayName: "@example/app-one",
  root: "/workspace/packages/app-one",
  path: "/@example/app-one",
  packageJson: { name: "@example/app-one" },
  config: {}
};

/**
 * Make a GET request against the Host's internal h3 app via `toWebHandler`.
 */
async function request(host: Host, path: string) {
  const { toWebHandler } = await import("h3");
  const handler = toWebHandler((host as any).app);
  const url = `http://localhost${path}`;
  return handler(new Request(url));
}

describe("Host", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("route registration", () => {
    it("should return project info from the __json route", async () => {
      const host = new Host([fakeProject]);

      const res = await request(host, "/@example/app-one/__json");
      const body = await res.json();

      expect(body).toEqual({
        project: "packages/app-one",
        displayName: "@example/app-one",
        root: "/workspace/packages/app-one",
        status: "registered"
      });
    });

    it("should list all projects from the root route", async () => {
      const host = new Host([fakeProject]);

      const res = await request(host, "/");
      const body = await res.json();

      expect(body).toEqual({
        velnora: true,
        projects: [
          {
            name: "packages/app-one",
            displayName: "@example/app-one",
            path: "/@example/app-one"
          }
        ]
      });
    });

    it("should list multiple projects from the root route", async () => {
      const second: Project = {
        ...fakeProject,
        name: "packages/app-two",
        displayName: "@example/app-two",
        path: "/@example/app-two"
      };

      const host = new Host([fakeProject, second]);

      const res = await request(host, "/");
      const body = await res.json();

      expect(body.projects).toHaveLength(2);
    });
  });

  describe("static content serving", () => {
    it("should serve a CSS file with correct content type", async () => {
      const mtime = new Date("2025-06-01");
      mockResolveStaticFile.mockReturnValue("/workspace/packages/app-one/src/style.css");
      mockReadFile.mockResolvedValue(Buffer.from("body { color: red; }") as any);
      mockStatSync.mockReturnValue({ size: 20, mtime } as any);

      const host = new Host([fakeProject]);
      const res = await request(host, "/@example/app-one/style.css");

      expect(res.headers.get("content-type")).toBe("text/css");
      const body = await res.text();
      expect(body).toBe("body { color: red; }");
    });

    it("should inject <base> tag into HTML that lacks one", async () => {
      const html = "<html><head><title>App</title></head><body></body></html>";
      const mtime = new Date("2025-06-01");
      mockResolveStaticFile.mockReturnValue("/workspace/packages/app-one/src/index.html");
      mockReadFile.mockResolvedValue(Buffer.from(html) as any);
      mockStatSync.mockReturnValue({ size: html.length, mtime } as any);

      const host = new Host([fakeProject]);
      const res = await request(host, "/@example/app-one/index.html");
      const body = await res.text();

      expect(body).toContain('<base href="/@example/app-one/" />');
      expect(body).toMatch(/<head><base href/);
    });

    it("should replace existing <base> tag in HTML", async () => {
      const html = '<html><head><base href="/" /><title>App</title></head></html>';
      const mtime = new Date("2025-06-01");
      mockResolveStaticFile.mockReturnValue("/workspace/packages/app-one/src/index.html");
      mockReadFile.mockResolvedValue(Buffer.from(html) as any);
      mockStatSync.mockReturnValue({ size: html.length, mtime } as any);

      const host = new Host([fakeProject]);
      const res = await request(host, "/@example/app-one/index.html");
      const body = await res.text();

      expect(body).toContain('<base href="/@example/app-one/" />');
      expect(body).not.toContain('<base href="/" />');
    });

    it("should return 404 when file does not exist", async () => {
      mockResolveStaticFile.mockReturnValue(null);

      const host = new Host([fakeProject]);
      const res = await request(host, "/@example/app-one/missing.txt");

      expect(res.status).toBe(404);
    });

    it("should use application/octet-stream for unknown extensions", async () => {
      const mtime = new Date();
      mockResolveStaticFile.mockReturnValue("/workspace/packages/app-one/src/data.bin");
      mockReadFile.mockResolvedValue(Buffer.from("binary") as any);
      mockStatSync.mockReturnValue({ size: 6, mtime } as any);

      const host = new Host([fakeProject]);
      const res = await request(host, "/@example/app-one/data.bin");

      expect(res.headers.get("content-type")).toBe("application/octet-stream");
    });
  });

  describe("listen / close lifecycle", () => {
    it("should call listhen listen with default options", async () => {
      const host = new Host([fakeProject]);

      await host.listen();

      expect(mockListen).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ port: 3000, hostname: "localhost", showURL: false })
      );
    });

    it("should forward custom port and host", async () => {
      const host = new Host([fakeProject], { port: 4000, host: "0.0.0.0" });

      await host.listen();

      expect(mockListen).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ port: 4000, hostname: "0.0.0.0" })
      );
    });

    it("should return the listener from listen()", async () => {
      const host = new Host([fakeProject]);

      const listener = await host.listen();

      expect(listener).toHaveProperty("url", "http://localhost:3000");
    });

    it("should close the listener on close()", async () => {
      const host = new Host([fakeProject]);

      await host.listen();
      await host.close();

      expect(mockCloseFn).toHaveBeenCalled();
    });

    it("should be safe to call close() without listen()", async () => {
      const host = new Host([fakeProject]);

      await expect(host.close()).resolves.toBeUndefined();
    });

    it("should be safe to call close() twice", async () => {
      const host = new Host([fakeProject]);

      await host.listen();
      await host.close();
      await host.close();

      expect(mockCloseFn).toHaveBeenCalledTimes(1);
    });
  });
});
