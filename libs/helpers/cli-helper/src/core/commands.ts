import yargs, { type Arguments, type Argv } from "yargs";
import { hideBin } from "yargs/helpers";

import type { CommandsType } from "../types/commands-type";
import { logger } from "../utils/logger";
import { Command } from "./command";

export class Commands {
  constructor(private readonly commands: CommandsType) {
    logger.debug("Commands initialized.");
  }

  async executeCommands(version: string, args = hideBin(process.argv)) {
    logger.debug("Executing commands with args:", { args });
    const argv = yargs();

    const commandObjects = await Promise.all(this.commands);
    this.applyCommands(argv, commandObjects);

    await argv
      .scriptName("velnora")
      .usage("$0 <command> [args]")
      .help()
      .alias("help", "h")
      .version(version)
      .alias("version", "v")
      .strict()
      .demandCommand(1, "You need to call one of the given commands or options.")
      .parse(args);
  }

  private applyCommands(argv: Argv, commands: Awaited<CommandsType[number]>[], parentCommand = "") {
    for (const cmdObject of commands.flatMap(cmd => Object.values(cmd))) {
      const {
        description: commandDescription,
        command: commandStr,
        childCommands,
        options = {},
        positionalOptions,
        execute = () => {}
      } = cmdObject instanceof Command ? cmdObject.execute() : cmdObject;

      const commandParts: string[] = [
        commandStr,
        ...positionalOptions.map(opt => ((opt.required ?? !!opt.default) ? `<${opt.name}>` : `[${opt.name}]`)),
        ...(Object.keys(options).length ? ["[options]"] : [])
      ];
      const commandNameForLogs = `${parentCommand} ${commandStr}`.trim();

      argv.command(
        commandParts.join(" "),
        commandDescription || "",
        async yargs => {
          childCommands && this.applyCommands(yargs, await Array.fromAsync(childCommands), commandNameForLogs);

          for (const opt of positionalOptions) {
            const { name, description: optDescription, required, default: defaultValue } = opt;
            const isRequired = required ?? !!defaultValue;
            logger.debug(`Adding positional argument to command '${commandStr}': ${name} (${isRequired})`);
            yargs.positional(name, { type: "string", description: optDescription, default: defaultValue });
            if (isRequired) yargs.demandOption(name);
          }

          const implicitOptions = new Map<string, Set<string>>();

          for (const [optionName, optionDetails] of Object.entries(options)) {
            const { type, description: optionDescription, default: defaultValue, alias, requires } = optionDetails;

            logger.debug(
              `Adding option to command "${commandNameForLogs}": ${optionName} (${type})${alias ? ` aliased to ${alias}` : ""}`
            );

            if (requires) {
              const requiredOptions = Array.isArray(requires) ? requires : [requires];
              for (const requiredOption of requiredOptions) {
                const opt = requiredOption.toString();

                const implicits = implicitOptions.get(optionName) || new Set<string>();
                implicits.add(opt);
                implicitOptions.set(optionName, implicits);
              }
            }

            if (type === "union") {
              yargs.option(optionName, {
                type,
                alias,
                description: requires
                  ? `${optionDescription} (requires ${Array.isArray(requires) ? requires.join(", ") : requires.toString()})`
                  : optionDescription,
                // @ts-ignore
                choices: optionDetails.values,
                default: defaultValue ?? undefined
              });
            } else {
              yargs.option(optionName, {
                type,
                alias,
                description: requires
                  ? `${optionDescription} (requires ${Array.isArray(requires) ? requires.join(", ") : requires.toString()})`
                  : optionDescription,
                default: defaultValue ?? undefined
              });
            }
          }

          if (implicitOptions.size) {
            for (const [optionName, requiredOptions] of implicitOptions.entries()) {
              const requiredOptionsArray = Array.from(requiredOptions);
              const requiredOptionsList = requiredOptionsArray.join(", ");
              yargs.check(argv => {
                if (argv[optionName] && !requiredOptionsArray.every(opt => argv[opt])) {
                  throw new Error(
                    `Option '${optionName}' requires the following options to be set: ${requiredOptionsList}`
                  );
                }
                return true;
              });
            }
          }

          yargs.version(false).strict().help().alias("help", "h");
        },
        async ({ _: _, $0: $0, ...args }: Arguments) => {
          logger.debug(`Executing command "${commandNameForLogs}" with args:`, args);

          try {
            await execute(args);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        }
      );
    }
  }
}
