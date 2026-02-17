import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { initWorkspace } from "./init-workspace";

describe("initWorkspace", () => {
  it("should create velnora.config.ts and package.json on first run", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    try {
      const result = initWorkspace(root);
      expect(result.status).toBe("created");
      expect(existsSync(result.configPath)).toBe(true);
      expect(existsSync(result.packageJsonPath)).toBe(true);
      expect(JSON.parse(readFileSync(result.packageJsonPath, "utf8"))).toMatchObject({
        name: basename(root),
        private: true,
        type: "module"
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("should return exists on subsequent runs", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    try {
      const first = initWorkspace(root);
      const second = initWorkspace(root);
      expect(first.status).toBe("created");
      expect(second.status).toBe("exists");
      expect(second.configPath).toBe(first.configPath);
      expect(second.packageJsonPath).toBe(first.packageJsonPath);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
