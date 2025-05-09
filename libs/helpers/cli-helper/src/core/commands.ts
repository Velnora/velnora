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

    const commandArgs = args.map(arg => arg.replace(/(?<!-)-\w/g, m => m.slice(1).toUpperCase()));

    await argv
      .scriptName("velnora")
      .usage("$0 <command> [args]")
      .help()
      .alias("help", "h")
      .version(version)
      .alias("version", "v")
      .strict()
      .demandCommand(1, "You need to call one of the given commands or options.")
      .parse(commandArgs);
  }

  private applyCommands(argv: Argv, commands: Awaited<CommandsType[number]>[]) {
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

      argv.command(
        commandParts.join(" "),
        commandDescription || "",
        async yargs => {
          childCommands && this.applyCommands(yargs, await Array.fromAsync(childCommands));

          for (const opt of positionalOptions) {
            const { name, description: optDescription, required, default: defaultValue } = opt;
            const isRequired = required ?? !!defaultValue;
            logger.debug(`Adding positional argument to command '${commandStr}': ${name} (${isRequired})`);
            yargs.positional(name, { type: "string", description: optDescription, default: defaultValue });
            if (isRequired) yargs.demandOption(name);
          }

          for (const [optionName, optionDetails] of Object.entries(options)) {
            const { type, description: optionDescription, default: defaultValue, alias } = optionDetails;

            logger.debug(
              `Adding option to command '${commandStr}': ${optionName} (${type})${alias ? ` aliased to ${alias}` : ""}`
            );

            if (type === "union") {
              yargs.option(optionName, {
                type,
                alias,
                description: optionDescription,
                // @ts-ignore
                choices: optionDetails.values,
                default: defaultValue ?? undefined
              });
            } else {
              yargs.option(optionName, {
                type,
                alias,
                description: optionDescription,
                default: defaultValue ?? undefined
              });
            }
          }
          yargs.version(false).help().alias("help", "h");
        },
        async ({ _: _, $0: $0, ...args }: Arguments) => {
          logger.debug(`Command '${commandStr}' called with args:`, args);

          try {
            logger.debug(`Executing command '${commandStr}' with args:`, args);
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
