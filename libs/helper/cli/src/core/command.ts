import type { Merge } from "type-fest";
import yargs, { type ArgumentsCamelCase, type Argv, type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import type { CommandDef } from "../types/command-def";
import type { ConfigOptions } from "../types/config-options";
import type { OptRecordFromSpec } from "../types/opt-record-from-spec";
import type { ParsedSpec } from "../types/parsed-spec";
import { parseSpec } from "../utils/parse-spec";

export class Command<TAccum extends object = object> {
  private _argv: Argv<unknown>;
  private _globals: ParsedSpec[] = []; // root-only options
  private _commands = new Map<string, CommandDef>();
  private _activeName?: string;

  private constructor(argv: Argv<unknown>) {
    this._argv = argv;
  }

  static create() {
    const argv = yargs(hideBin(process.argv))
      .help()
      .strictCommands()
      .recommendCommands()
      .parserConfiguration({ "strip-aliased": false, "camel-case-expansion": true });
    return new Command(argv);
  }

  name(n: string) {
    this._argv = this._argv.scriptName(n);
    return this;
  }

  description(_d: string) {
    return this;
  }
  version(v: string) {
    this._argv = this._argv.version(v);
    return this;
  }

  command<N extends string>(name: N, desc?: string): Command {
    const def = this._commands.get(name) ?? { name, options: [] };
    def.desc = desc ?? def.desc;
    this._commands.set(name, def);
    this._activeName = name;
    return this;
  }

  // Overload: config-object form
  option<const TSpec extends `--${string}`>(
    spec: TSpec,
    cfg?: ConfigOptions<TSpec>
  ): Command<Merge<TAccum, OptRecordFromSpec<TSpec>>>;

  option<const TSpec extends `--${string}`>(spec: TSpec, config?: ConfigOptions<TSpec>): Command {
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

    if (this._activeName) {
      const def = this._commands.get(this._activeName)!;
      const cc = conflicts(parsed, def.options);
      if (cc.longs.length || cc.shorts.length) {
        throw new Error(`Option(s) ${format(cc)} already defined in command "${this._activeName}".`);
      }
      def.options.push(parsed);
    } else {
      const cg = conflicts(parsed, this._globals);
      if (cg.longs.length || cg.shorts.length) {
        throw new Error(`GLOBAL option(s) ${format(cg)} already defined.`);
      }
      this._globals.push(parsed);
    }

    return this;
  }

  action(handler: (args: ArgumentsCamelCase<TAccum>) => void | Promise<void>) {
    if (!this._activeName) {
      const root = this._commands.get("$0") ?? { name: "$0", options: [] };
      root.handler = handler as unknown as CommandDef["handler"];
      this._commands.set("$0", root);
    } else {
      const def = this._commands.get(this._activeName)!;
      def.handler = handler as unknown as CommandDef["handler"];
      this._activeName = undefined; // clear active after binding handler
    }
    return this;
  }

  async parseAsync(): Promise<unknown> {
    const argvInput = hideBin(process.argv);

    // Root ($0): apply globals for help visibility; attach root handler if present
    const root = this._commands.get("$0");
    if (root || this._globals.length) {
      const rootHandler = root?.handler as
        | ((a: ArgumentsCamelCase<Record<string, unknown>>) => void | Promise<void>)
        | undefined;
      const resolvedRootHandler = rootHandler ?? (() => {});

      this._argv = this._argv.command(
        "$0",
        "",
        ya => this._applyOptions(ya, this._globals),
        async args => {
          try {
            return await resolvedRootHandler(args);
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        }
      );
    } else {
      this._argv = this._applyOptions(this._argv, this._globals);
    }

    // Register subcommands
    for (const [name, def] of this._commands) {
      if (name === "$0") continue;
      const handler = def.handler ?? (() => {});
      this._argv = this._argv.command(
        name,
        def.desc ?? "",
        ya => this._applyOptions(ya, def.options),
        async args => {
          try {
            return await handler(args);
          } catch (err) {
            console.error("Error executing command:", err);
            process.exit(1);
          }
        }
      );
    }

    return this._argv.parseAsync(argvInput);
  }

  private _applyOptions = <U>(ya: Argv<U>, specs: ParsedSpec[]): Argv<U> => {
    let acc = ya;

    // local helpers only; keep logic contained to this method
    const toNumber = (x: unknown, key: string): number => {
      const n = typeof x !== "number" ? Number(x) : x;
      if (Number.isNaN(n)) {
        throw new Error(`Expected a number for --${key}, got ${JSON.stringify(x)}`);
      }
      return n;
    };
    const splitMaybe = (v: unknown): unknown[] => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        return v
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);
      }
      return [v];
    };

    for (const s of specs) {
      const key = s.longs[0];
      if (!key) continue;

      const aliasList = [...s.longs.slice(1), ...s.shorts];
      const hasDefault = typeof s.defaultValue !== "undefined";

      const optCfg: Options = {
        type: s.type === "enum" ? "string" : s.type, // "boolean" | "number" | "string" | "array"
        describe: s.description,
        choices: s.type === "enum" ? s.choices : undefined,
        alias: aliasList.length ? aliasList : undefined,
        array: s.array ? true : undefined,
        default: s.defaultValue
      };

      // Coerce & validate
      if (s.type === "number") {
        optCfg.coerce = (v: unknown) =>
          !s.isRequired ? v : s.array ? splitMaybe(v).map(item => toNumber(item, key)) : toNumber(v, key);
      } else if (s.type === "string") {
        optCfg.coerce = (v: unknown) =>
          !s.isRequired
            ? v
            : s.array
              ? splitMaybe(v).map(item => (typeof item === "string" ? item.trim() : String(item)))
              : typeof v === "string"
                ? v.trim()
                : String(v);
      }
      // boolean: yargs handles true/false and --no- flags

      acc = acc.option(key, optCfg) as Argv<U>;

      // Only demand if value is required and there is no default
      if (s.isRequired && s.type !== "boolean" && !hasDefault) {
        acc = acc.demandOption(key);
      }
    }

    return acc.strictOptions();
  };
}
