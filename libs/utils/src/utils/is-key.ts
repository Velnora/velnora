/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

export const isKey = (v: unknown) => {
  const t = typeof v;
  return t === "string" || t === "number" || t === "symbol";
};
