import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { initWorkspace } from "./init-workspace";

describe("initWorkspace", () => {
  it("should create velnora.config.ts on first run", () => {
    const root = mkdtempSync(join(tmpdir(), "velnora-generator-"));
    try {
      const result = initWorkspace(root);
      expect(result.status).toBe("created");
      expect(existsSync(result.configPath)).toBe(true);
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
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
