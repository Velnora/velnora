import { type LogLevel, LogLevels } from "consola";

export const logLevelName = (import.meta.env.LOG_LEVEL || "info").toLowerCase() as keyof typeof LogLevels;
if (!(logLevelName in LogLevels)) {
  // ToDo: Handle Error
  throw new Error(`Invalid log level: ${logLevelName}. Valid levels are: ${Object.keys(LogLevels).join(", ")}`);
}
export const envLogLevel: LogLevel = LogLevels[logLevelName] ?? LogLevels.debug;
