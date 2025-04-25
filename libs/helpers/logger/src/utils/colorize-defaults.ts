import pc from "picocolors";

import type { ColorScheme } from "../types/color-scheme";

export const colorizeDefaults: ColorScheme = {
  null: pc.gray,
  undefined: pc.gray,
  boolean: pc.yellow,
  number: pc.cyan,
  bigint: pc.cyan,
  string: pc.green,
  symbol: pc.magenta,
  function: pc.blue,
  date: pc.magenta,
  regexp: pc.red,
  key: s => pc.bold(pc.cyan(s)),
  colon: pc.dim,
  brace: pc.dim,
  comma: pc.dim,
  mapArrow: pc.dim,
  circular: pc.red
};
