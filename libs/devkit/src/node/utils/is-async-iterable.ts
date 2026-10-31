export const isAsyncIterable = (body: unknown): body is AsyncIterable<Uint8Array> =>
  // @ts-expect-error
  !!body && Symbol.asyncIterator in body && typeof body[Symbol.asyncIterator] === "function";
