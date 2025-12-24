import yargs, { type Argv, type Options } from "yargs";
import { hideBin } from "yargs/helpers";

import type { CommandDef } from "../types/command-def";
import type { ConfigOptions } from "../types/config-options";
import type { ParsedSpec } from "../types/parsed-spec";
import { parseSpec } from "../utils/parse-spec";
import { SingleCommand } from "./single-command";

export class Command {
  private _argv: Argv<unknown>;
  private options: ParsedSpec[] = []; // root-only options
  private _commands = new Map<string, SingleCommand>();

  private constructor(argv: Argv<unknown>) {
    this._argv = argv;
  }

  static create() {
    const argv = yargs(hideBin(process.argv))
      .help()
      .strict()
      .recommendCommands()
      .demandCommand(1, "You must provide a command")
      .help()
      .parserConfiguration({ "strip-aliased": false, "camel-case-expansion": true });
    return new Command(argv);
  }

  name(n: string) {
    this._argv = this._argv.scriptName(n);
    return this;
  }

  description(description: string) {
    this._argv = this._argv.usage(description);
    return this;
  }

  version(v: string) {
    this._argv = this._argv.version(v);
    return this;
  }

  command<N extends string>(name: N, desc?: string) {
    const command = this._commands.get(name) ?? new SingleCommand(name);
    if (desc) command.description(desc);
    this._commands.set(name, command);
    return command;
  }

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
      throw new Error(`Option(s) ${format(cc)} already registered for $0.`);
    }
    this.options.push(parsed);

    return this;
  }

  parse() {
    this._build();
    return this._argv.parse();
  }

  async parseAsync(): Promise<unknown> {
    this._build();
    return this._argv.parseAsync();
  }

  private _build() {
    this._argv = this._applyOptions(this._argv, this.options);
    this._argv = this._applyCommands(this._argv, Array.from(this._commands.values()));
  }

  private _applyCommands = <U>(acc: Argv<U>, commands: CommandDef[]) => {
    // Register subcommands
    for (const command of commands) {
      const handler = command.handler ?? (() => {});
      acc = acc.command(
        command.name,
        command.describe ?? "",
        yargs => {
          yargs = this._applyOptions(yargs, command.options);
          yargs = this._applyCommands(yargs, command.commands);
          return yargs;
        },
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

    return acc.strictCommands();
  };

  private _applyOptions = <U>(acc: Argv<U>, specs: ParsedSpec[]) => {
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
