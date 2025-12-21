// Small, predictable deep-merge for plain objects.
// - merges objects
// - replaces arrays / primitives
export const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;
