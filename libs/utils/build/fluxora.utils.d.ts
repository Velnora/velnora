import { HttpTransportOptions } from 'winston/lib/winston/transports';
import { Logger } from 'winston';
import { SecureContextOptions } from 'node:tls';

export declare const createLogger: (options?: LoggerOptions) => Logger;

declare type LoggerHttpAuthOptions = LoggerHttpAuthOptionsBasic | LoggerHttpAuthOptionsBearer;

declare interface LoggerHttpAuthOptionsBasic {
    type: "basic";
    username: string;
    password: string;
}

declare interface LoggerHttpAuthOptionsBearer {
    type: "bearer";
    token: string;
}

declare interface LoggerHttpBatchOptions {
    count: number;
    interval: number;
}

declare interface LoggerHttpOptions extends Pick<HttpTransportOptions, "path" | "headers"> {
    batch?: false | Partial<LoggerHttpBatchOptions>;
    auth?: LoggerHttpAuthOptions;
    ssl?: LoggerHttpSSLOptions;
}

declare interface LoggerHttpSSLOptions extends SecureContextOptions {
}

declare interface LoggerOptions {
    name: string;
    logLevel?: string;
    pipeToConsole?: boolean;
    pipeToFile?: boolean;
    pipeToUrl?: boolean;
    http?: LoggerHttpOptions;
}

export { }
