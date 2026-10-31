import { isReadable as isNodeReadable, Readable } from "node:stream";

export const isReadable = (stream: unknown): stream is Readable =>
  stream instanceof Readable ? !!isNodeReadable(stream) : false;
