import { SecureContextOptions } from "node:tls";

import type { HttpTransportOptions } from "winston/lib/winston/transports";

interface LoggerHttpAuthOptionsBasic {
  type: "basic";
  username: string;
  password: string;
}

interface LoggerHttpAuthOptionsBearer {
  type: "bearer";
  token: string;
}

type LoggerHttpAuthOptions = LoggerHttpAuthOptionsBasic | LoggerHttpAuthOptionsBearer;

interface LoggerHttpSSLOptions extends SecureContextOptions {}

interface LoggerHttpBatchOptions {
  count: number;
  interval: number;
}

interface LoggerHttpOptions extends Pick<HttpTransportOptions, "path" | "headers"> {
  batch?: false | Partial<LoggerHttpBatchOptions>;
  auth?: LoggerHttpAuthOptions;
  ssl?: LoggerHttpSSLOptions;
}

export interface LoggerOptions {
  name: string;
  logLevel?: string;
  pipeToConsole?: boolean;
  pipeToFile?: boolean;
  pipeToUrl?: boolean;
  http?: LoggerHttpOptions;
}
