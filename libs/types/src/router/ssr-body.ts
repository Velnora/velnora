import type { Readable } from "node:stream";

export type SsrBody = string | Buffer | Uint8Array | Readable | AsyncIterable<Uint8Array>;
