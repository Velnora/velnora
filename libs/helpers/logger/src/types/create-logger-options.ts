import type { LogFormats } from "./log-formats";
import type { Transformers } from "./transformers";

export interface CreateLoggerOptions {
  name: string;
  format?: string | LogFormats;
  transformers?: Transformers;
}
