export const isAsyncIterable = (body: unknown): body is AsyncIterable<Uint8Array> =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  !!body && Symbol.asyncIterator in body && typeof body[Symbol.asyncIterator] === "function";
