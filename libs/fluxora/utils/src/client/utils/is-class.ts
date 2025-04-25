export const isClass = (value: unknown): value is new (...args: any[]) => any => {
  return typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value));
};
