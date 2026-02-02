import type { ConfigOptions } from "../types/config-options";
import type { ParsedSpec } from "../types/parsed-spec";
import type { ValueKind } from "../types/value-kind";

export const parseSpec = <TSpec extends string>(spec: TSpec, configOptions?: ConfigOptions<TSpec>): ParsedSpec => {
  const segments = spec
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const longs: string[] = [];
  const shorts: string[] = [];

  for (const seg of segments) {
    if (seg.startsWith("--")) {
      const long = seg.replace(/^--/, "").split(/[ <[]/)[0]; // before space/<[
      if (long) longs.push(long);
    } else if (/^-\w/.test(seg) && !/^--/.test(seg)) {
      const name = seg.slice(1).trim().split(/\s+/)[0];
      if (name?.length === 1) shorts.push(name); // only single-char
    }
  }

  // tokens consistency check (all aliases share same token)
  const tokens = segments.flatMap(s => [...s.matchAll(/(<[^>]+>|\[[^\]]+])/g)].map(m => m[1]));
  const normalize = (tok?: string) => {
    if (!tok) return "opt:one:boolean"; // no token means boolean optional single
    const required = tok.startsWith("<");
    const inner = tok.slice(1, -1);
    const variadic = inner.endsWith("...");
    const base = variadic ? inner.slice(0, -3) : inner;
    return `${required ? "req" : "opt"}:${variadic ? "var" : "one"}:${base}`;
  };
  const distinct = new Set(tokens.map(normalize));
  if (distinct.size > 1) {
    throw new Error(`Conflicting value tokens in "${spec}". Aliases must share one type/arity.`);
  }

  let type: ValueKind = "boolean";
  let array = false;
  let choices: string[] = [];

  if (tokens[0]) {
    const inner = tokens[0].slice(1, -1);
    array = inner.endsWith("...");
    const base = array ? inner.slice(0, -3) : inner;
    switch (base) {
      case "number":
      case "count":
        type = "number";
        break;
      case "string":
      case "path":
        type = "string";
        break;
      case "boolean":
        type = "boolean";
        break;
      default:
        type = "enum";
        choices = base
          .split("|")
          .map(s => s.trim())
          .filter(Boolean);
    }
  }

  if (longs.length === 0) throw new Error(`Invalid option spec (missing --long): "${spec}"`);

  return {
    longs,
    shorts,
    type,
    array,
    choices,
    description: configOptions?.description,
    defaultValue: configOptions?.default,
    isRequired: configOptions?.required ?? false
  };
};
