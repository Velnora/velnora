import yargs, { type Arguments, type Argv } from "yargs";
import { hideBin } from "yargs/helpers";

import type { CommandReturnType } from "../types/command-return-type";
import { logger } from "../utils/logger";
import { Command } from "./command";

export type CommandsType = Promise<Record<string, Command<any> | CommandReturnType<any>>>[];

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
      .scriptName("fluxora")
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
        description,
        command: commandStr,
        childCommands,
        options = {},
        execute = () => {}
      } = cmdObject instanceof Command ? cmdObject.execute() : cmdObject;

      argv.command(
        commandStr,
        description || "",
        async yargs => {
          childCommands && this.applyCommands(yargs, await Array.fromAsync(childCommands));

          for (const [optionName, optionDetails] of Object.entries(options)) {
            const { type, defaultValue, alias, description } = optionDetails;

            logger.debug(
              `Adding option to command '${commandStr}': ${optionName} (${type})${alias ? ` aliased to ${alias}` : ""}`
            );

            if (type === "union") {
              yargs.option(optionName, {
                type,
                alias,
                description,
                // @ts-ignore
                choices: optionDetails.values,
                default: defaultValue ?? undefined
              });
            } else {
              yargs.option(optionName, {
                type,
                alias,
                description,
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
