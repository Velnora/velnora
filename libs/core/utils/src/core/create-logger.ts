import consola from "consola";
import { type ConsolaInstance, type LogLevel, LogLevels, type LogObject, type LogType } from "consola";

import type { CreateLoggerOptions } from "../types/create-logger-options";
import type { Logger } from "../types/logger";

export function createLogger({ name, servers = [], transform = a => a }: CreateLoggerOptions): Logger {
  const logger: ConsolaInstance = consola.withTag(name);

  const sendLogToServers = (logObject: LogObject, args: any[]) => {
    if (servers.length === 0) return;

    const transformedLog = transform(...args);
    const payload = Array.isArray(transformedLog) ? transformedLog : [transformedLog];

    servers.forEach(async ({ url, headers }) => {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({
            name: name,
            level: logObject.type,
            data: payload,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        logger.error(`Failed to send log to ${url}`, error);
      }
    });
  };

  const logHandler = (logObject: LogObject, messages: any[]) => {
    logger[logObject.type](logObject, ...messages);
    sendLogToServers(logObject, messages);
  };

  const logFn =
    (level: LogLevel, type: LogType) =>
    (...messages: any[]) =>
      logHandler({ tag: name, level, type, args: [], date: new Date() }, messages);

  return {
    debug: logFn(LogLevels.debug, "debug"),
    info: logFn(LogLevels.info, "info"),
    warn: logFn(LogLevels.warn, "warn"),
    success: logFn(LogLevels.success, "success"),
    error: logFn(LogLevels.error, "error")
  };
}
