import { Logger, config, createLogger as createWinstonLogger, format, transports } from "winston";
import * as Transport from "winston-transport";

import type { LoggerOptions } from "./create-logger.types";

export const createLogger = (options?: LoggerOptions): Logger => {
  const { name, pipeToConsole = true, pipeToFile = false, pipeToUrl = false, http, logLevel = "info" } = options || {};

  const printFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : "";
    return `[Fluxora] ${process.pid} - ${timestamp} [${level}] (${name}): ${message} ${metaString}`;
  });

  const loggerTransports: Transport[] = [];

  // File transports
  if (pipeToFile) {
    loggerTransports.push(
      new transports.File({
        filename: "logs/error.log",
        level: "error",
        format: format.combine(format.uncolorize())
      }),
      new transports.File({
        filename: "logs/warn.log",
        level: "warn",
        format: format.combine(format.uncolorize())
      }),
      new transports.File({
        filename: "logs/info.log",
        level: "info",
        format: format.combine(format.uncolorize())
      }),
      new transports.File({
        filename: "logs/verbose.log",
        level: "verbose",
        format: format.combine(format.uncolorize())
      }),
      new transports.File({
        filename: "logs/debug.log",
        level: "debug",
        format: format.combine(format.uncolorize())
      }),
      new transports.File({
        filename: "logs/silly.log",
        level: "silly",
        format: format.combine(format.uncolorize())
      })
    );
  }

  // Console transport
  if (pipeToConsole) {
    loggerTransports.push(
      new transports.Console({
        format: format.combine(
          format.colorize({ all: true }),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.simple(),
          printFormat
        )
      })
    );
  }

  // HTTP transport
  if (pipeToUrl && http) {
    loggerTransports.push(
      new transports.Http({
        path: http.path,
        headers: http.headers,
        auth: http.auth
          ? http.auth.type === "basic"
            ? { username: http.auth.username, password: http.auth.password }
            : { bearer: http.auth.token }
          : undefined,
        ssl: http.ssl,
        format: format.combine(format.json())
      })
    );
  }

  return createWinstonLogger({
    level: logLevel,
    levels: config.npm.levels,
    format: format.combine(
      format.colorize({
        all: true,
        colors: {
          error: "red",
          warn: "yellow",
          data: "grey",
          info: "white",
          debug: "cyan",
          verbose: "cyan",
          silly: "magenta",
          custom: "blue"
        }
      }),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.simple(),
      printFormat
    ),
    transports: loggerTransports
  });
};
