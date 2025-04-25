import type { ColorScheme } from "../types/color-scheme";
import { colorizeDefaults } from "./colorize-defaults";

export const colorize = (
  value: any,
  colors: Partial<ColorScheme> = colorizeDefaults,
  seen = new WeakSet(),
  depth = 0
): string => {
  const c = { ...colorizeDefaults, ...colors };
  const type = typeof value;

  if (value === null) return c.null("null");
  if (type === "undefined") return c.undefined("undefined");
  if (type === "boolean") return c.boolean(String(value));
  if (type === "number") return c.number(String(value));
  if (type === "bigint") return c.bigint(`${value}n`);
  if (type === "string") {
    return depth === 0 ? value : c.string(`"${value}"`);
  }
  if (type === "symbol") return c.symbol(String(value));
  if (type === "function") return c.function(`[Function ${value.name || "anonymous"}]`);

  if (seen.has(value)) return c.circular("[Circular]");
  seen.add(value);

  if (Array.isArray(value)) {
    const items = value.map(v => colorize(v, colors, seen, depth + 1));
    return `${c.brace("[")}${items.join(c.comma(", "))}${c.brace("]")}`;
  }

  if (value instanceof Date) return c.date(value.toISOString());
  if (value instanceof RegExp) return c.regexp(value.toString());

  if (value instanceof Set) {
    const items = [...value].map(v => colorize(v, colors, seen, depth + 1)).join(c.comma(", "));
    return `Set ${c.brace("{")}${items}${c.brace("}")}`;
  }

  if (value instanceof Map) {
    const entries = [...value.entries()]
      .map(
        ([k, v]) =>
          `${colorize(k, colors, seen, depth + 1)} ${c.mapArrow("=>")} ${colorize(v, colors, seen, depth + 1)}`
      )
      .join(c.comma(", "));
    return `Map ${c.brace("{")}${entries}${c.brace("}")}`;
  }

  if (type === "object") {
    const entries = Object.entries(value)
      .map(([k, v]) => `${c.key(k)}${c.colon(":")} ${colorize(v, colors, seen, depth + 1)}`)
      .join(c.comma(", "));
    return `${c.brace("{")} ${entries} ${c.brace("}")}`;
  }

  return String(value);
};
