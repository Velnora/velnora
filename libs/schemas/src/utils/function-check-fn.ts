export const functionCheckFn = (fn: unknown): fn is (...args: unknown[]) => unknown => {
  return typeof fn === "function";
};
