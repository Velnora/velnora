import { type MockInstance, beforeEach, describe, expect, it, vi } from "vitest";

import { LogLevel } from "@velnora/types";

import { Logger } from "./logger";

describe("Logger", () => {
  let stdoutSpy: MockInstance;
  let stderrSpy: MockInstance;

  beforeEach(() => {
    stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  });

  describe("create", () => {
    it("should create a Logger with empty context by default", () => {
      const logger = Logger.create();
      expect(logger).toBeInstanceOf(Logger);
      expect(logger.context).toEqual({});
    });

    it("should create a Logger with provided context", () => {
      const ctx = { module: "test" };
      const logger = Logger.create(ctx);
      expect(logger.context).toEqual(ctx);
    });
  });

  describe("minLevel", () => {
    it("should default to DEBUG", () => {
      const logger = Logger.create();
      expect(logger.minLevel).toBe(LogLevel.DEBUG);
    });

    it("should update via setMinLevel", () => {
      const logger = Logger.create();
      logger.setMinLevel(LogLevel.ERROR);
      expect(logger.minLevel).toBe(LogLevel.ERROR);
    });
  });

  describe("write", () => {
    it("should write to stdout for levels below ERROR", () => {
      const logger = Logger.create();
      logger.setMinLevel(LogLevel.TRACE);
      logger.write(LogLevel.LOG, undefined, "hello");
      expect(stdoutSpy).toHaveBeenCalled();
    });

    it("should write to stderr for ERROR and above", () => {
      const logger = Logger.create();
      logger.write(LogLevel.ERROR, undefined, "oops");
      expect(stderrSpy).toHaveBeenCalled();
    });

    it("should not write when level is below minLevel", () => {
      const logger = Logger.create();
      logger.setMinLevel(LogLevel.ERROR);
      logger.write(LogLevel.DEBUG, undefined, "ignored");
      expect(stdoutSpy).not.toHaveBeenCalled();
      expect(stderrSpy).not.toHaveBeenCalled();
    });
  });

  describe("convenience methods", () => {
    it("should call write from trace()", () => {
      const logger = Logger.create();
      logger.setMinLevel(LogLevel.TRACE);
      const spy = vi.spyOn(logger, "write");
      logger.trace("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.TRACE, undefined, "msg");
    });

    it("should call write from debug()", () => {
      const logger = Logger.create();
      const spy = vi.spyOn(logger, "write");
      logger.debug("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.DEBUG, undefined, "msg");
    });

    it("should call write from log()", () => {
      const logger = Logger.create();
      const spy = vi.spyOn(logger, "write");
      logger.log("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.LOG, undefined, "msg");
    });

    it("should call write from warn()", () => {
      const logger = Logger.create();
      const spy = vi.spyOn(logger, "write");
      logger.warn("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.WARN, undefined, "msg");
    });

    it("should call write from error()", () => {
      const logger = Logger.create();
      const spy = vi.spyOn(logger, "write");
      logger.error("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.ERROR, undefined, "msg");
    });

    it("should call write from fatal()", () => {
      const logger = Logger.create();
      const spy = vi.spyOn(logger, "write");
      logger.fatal("msg");
      expect(spy).toHaveBeenCalledWith(LogLevel.FATAL, undefined, "msg");
    });
  });

  describe("extend", () => {
    it("should return a new Logger with merged context", () => {
      const logger = Logger.create({ module: "a" });
      const extended = logger.extend({ feature: "b" });
      expect(extended).toBeInstanceOf(Logger);
      expect(extended).not.toBe(logger);
      expect(extended.context).toMatchObject({ module: "a", feature: "b" });
    });

    it("should preserve minLevel in extended logger", () => {
      const logger = Logger.create();
      logger.setMinLevel(LogLevel.WARN);
      const extended = logger.extend({});
      expect(extended.minLevel).toBe(LogLevel.WARN);
    });
  });
});
