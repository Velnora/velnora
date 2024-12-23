import { format, transports, createLogger as createLogger$1 } from 'winston';

const createLogger = (options) => {
  const { name, pipeToConsole = true, pipeToFile = false, pipeToUrl = false, http, logLevel = "info" } = options || {};
  const printFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : "";
    return `${timestamp} [${name}] [${level}]: ${message} ${metaString}`;
  });
  const loggerTransports = [];
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
  if (pipeToUrl && http) {
    loggerTransports.push(
      new transports.Http({
        path: http.path,
        headers: http.headers,
        auth: http.auth ? http.auth.type === "basic" ? { username: http.auth.username, password: http.auth.password } : { bearer: http.auth.token } : void 0,
        ssl: http.ssl,
        format: format.combine(format.json())
      })
    );
  }
  return createLogger$1({
    level: logLevel,
    levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
    format: format.combine(
      format.colorize({ all: true }),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.simple(),
      printFormat
    ),
    transports: loggerTransports
  });
};

export { createLogger };
//# sourceMappingURL=fluxora.utils.js.map
