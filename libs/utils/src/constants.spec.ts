import { describe, expect, it } from "vitest";

import { LogLevel } from "@velnora/types";

import { LEVEL_COLOR, LEVEL_LABEL, VELNORA_CONFIG_FILES } from "./constants";

describe("LEVEL_LABEL", () => {
  it.each([
    [LogLevel.TRACE, "TRACE"],
    [LogLevel.DEBUG, "DEBUG"],
    [LogLevel.LOG, "LOG"],
    [LogLevel.WARN, "WARN"],
    [LogLevel.ERROR, "ERROR"],
    [LogLevel.FATAL, "FATAL"]
  ])("should map LogLevel %i to %s", (level, label) => {
    expect(LEVEL_LABEL[level]).toBe(label);
  });
});

describe("LEVEL_COLOR", () => {
  it("should have a color function for every log level", () => {
    for (const level of [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]) {
      expect(typeof LEVEL_COLOR[level]).toBe("function");
    }
  });

  it("should return a string when called", () => {
    for (const level of [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]) {
      const result = LEVEL_COLOR[level]("test");
      expect(typeof result).toBe("string");
    }
  });
});

describe("constants", () => {
  it("should define VELNORA_CONFIG_FILES", () => {
    expect(VELNORA_CONFIG_FILES).toEqual(["velnora.config.ts", "velnora.config.js", "velnora.config.json"]);
  });
});
