import type { Merge } from "type-fest";
import type { ArgumentsCamelCase, Argv, Options } from "yargs";
import { hideBin } from "yargs/helpers";

import type { CommandDef } from "../types/command-def";
import type { ConfigOptions } from "../types/config-options";
import type { OptRecordFromSpec } from "../types/opt-record-from-spec";
import type { ParsedSpec } from "../types/parsed-spec";
import { parseSpec } from "../utils/parse-spec";

export class SingleCommand<TAccum extends object = object> implements CommandDef<TAccum> {
  declare handler: CommandDef<TAccum>["handler"];
  declare describe: string | undefined;
  options: ParsedSpec[] = [];

  constructor(readonly name: string) {}

  description(desc: string) {
    this.describe = desc;
    return this;
  }

  // Overload: config-object form
  option<const TSpec extends `--${string}`>(
    spec: TSpec,
    config?: ConfigOptions<TSpec>
  ): SingleCommand<Merge<TAccum, OptRecordFromSpec<TSpec>>>;

  option<const TSpec extends `--${string}`>(spec: TSpec, config?: ConfigOptions<TSpec>) {
    const parsed = parseSpec(spec, config);

    // small local utilities (function-scope, not class members)
    const collect = (specs: ParsedSpec[]) => {
      const longs = new Set<string>(),
        shorts = new Set<string>();
      for (const s of specs) {
        s.longs.forEach(l => longs.add(l));
        s.shorts.forEach(sh => shorts.add(sh));
      }
      return { longs, shorts };
    };

    const conflicts = (cand: ParsedSpec, pool: ParsedSpec[]) => {
      const res = { longs: [] as string[], shorts: [] as string[] };
      const c = collect(pool);
      for (const l of cand.longs) if (c.longs.has(l)) res.longs.push(l);
      for (const sh of cand.shorts) if (c.shorts.has(sh)) res.shorts.push(sh);
      return res;
    };

    const format = (c: { longs: string[]; shorts: string[] }) =>
      [...c.longs.map(l => `--${l}`), ...c.shorts.map(s => `-${s}`)].join(", ");

    const cc = conflicts(parsed, this.options);
    if (cc.longs.length || cc.shorts.length) {
      throw new Error(`Option(s) ${format(cc)} already registered. Command: "${this.name}".`);
    }
    this.options.push(parsed);

    return this as SingleCommand<Merge<TAccum, OptRecordFromSpec<TSpec>>>;
  }

  action(handler: CommandDef<TAccum>["handler"]) {
    this.handler = handler;
  }
}
