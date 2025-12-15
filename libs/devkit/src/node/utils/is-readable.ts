import { Readable, isReadable as isNodeReadable } from "node:stream";

export const isReadable = (stream: unknown): stream is Readable =>
  stream instanceof Readable ? !!isNodeReadable(stream) : false;
