import { describe, expect, it } from "vitest";

import { VELNORA_CONFIG_FILES } from "./constants";

describe("constants", () => {
  it("should define VELNORA_CONFIG_FILES", () => {
    expect(VELNORA_CONFIG_FILES).toEqual(["velnora.config.ts", "velnora.config.js", "velnora.config.json"]);
  });
});
