import { describe, expect, it } from "vitest";

import { createLogger } from "./create-logger";
import { Logger } from "./logger";

describe("createLogger", () => {
  it("should return a Logger instance", () => {
    const logger = createLogger();
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should accept a context object", () => {
    const ctx = { module: "test" };
    const logger = createLogger(ctx);
    expect(logger.context).toEqual(ctx);
  });

  it("should create loggers with empty context by default", () => {
    const logger = createLogger();
    expect(logger.context).toEqual({});
  });
});
