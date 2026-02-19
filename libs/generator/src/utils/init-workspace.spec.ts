import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
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

  it("should create nested directories recursively", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    const nested = join(root, "a", "b", "c");
    try {
      const result = initWorkspace(nested);
      expect(result.status).toBe("created");
      expect(existsSync(result.configPath)).toBe(true);
      expect(result.configPath).toBe(resolve(nested, "velnora.config.ts"));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("should return created when only config exists but package.json does not", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    try {
      writeFileSync(join(root, "velnora.config.ts"), "// existing", "utf8");
      const result = initWorkspace(root);
      expect(result.status).toBe("created");
      expect(existsSync(result.packageJsonPath)).toBe(true);
      // original config should remain untouched
      expect(readFileSync(result.configPath, "utf8")).toBe("// existing");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("should generate config template that includes defineConfig", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    try {
      const result = initWorkspace(root);
      const content = readFileSync(result.configPath, "utf8");
      expect(content).toContain('import { defineConfig } from "velnora"');
      expect(content).toContain("defineConfig(");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
