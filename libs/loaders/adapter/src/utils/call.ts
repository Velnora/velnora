export function call(value: any) {
  return typeof value === "function" ? value() : undefined;
}
