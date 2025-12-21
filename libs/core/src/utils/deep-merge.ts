import { isPlainObject } from "./is-plain-object";

export const deepMerge = <T>(base: T, patch: unknown): T => {
  if (!isPlainObject(base) || !isPlainObject(patch)) return (patch as T) ?? base;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch)) {
    const prev = out[k];
    out[k] = isPlainObject(prev) && isPlainObject(v) ? deepMerge(prev, v) : v;
  }
  return out as T;
};
