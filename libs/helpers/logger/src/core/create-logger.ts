import type { CreateLoggerOptions } from "../types";
import { Logger } from "./logger";

export const createLogger = (options: CreateLoggerOptions): Logger => new Logger(options);
