import { describe, expect, it } from "vitest";

import { buildEntries } from "./build-entries";

describe("buildEntries", () => {
  it("should return default entry when entries is undefined", () => {
    const result = buildEntries("velnora.kernel");
    expect(result).toEqual({ "velnora.kernel": "src/main.ts" });
  });

  it("should handle string entry", () => {
    const result = buildEntries("velnora.kernel", "src/extra.ts");
    expect(result).toEqual({
      "velnora.kernel": "src/main.ts",
      "velnora.extra.ts": "src/extra.ts"
    });
  });

  it("should handle array entries", () => {
    const result = buildEntries("velnora.kernel", ["src/a.ts", "src/b.ts"]);
    expect(result).toEqual({
      "velnora.kernel": "src/main.ts",
      "velnora.kernel.a.ts": "src/a.ts",
      "velnora.kernel.b.ts": "src/b.ts"
    });
  });

  it("should handle object entries", () => {
    const result = buildEntries("velnora.kernel", { extra: "src/extra.ts" });
    expect(result).toEqual({
      "velnora.kernel": "src/main.ts",
      extra: "src/extra.ts"
    });
  });
});
