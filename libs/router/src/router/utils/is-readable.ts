import { type Readable, isReadable as isNodeReadable } from "node:stream";

export const isReadable = (stream: Readable | NodeJS.ReadableStream): stream is Readable => !!isNodeReadable(stream);
