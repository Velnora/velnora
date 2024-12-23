import { createLogger } from '@fluxora/utils';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const logger = createLogger({
  name: "fluxora/cli",
  logLevel: process.env.LOG_LEVEL || "info"
});

class Command {
  constructor(command, description) {
    this.command = command;
    this.description = description;
    logger.debug(`Created command: ${command} - ${description}`);
  }
  options = {};
  option(name, type) {
    const resolvedValue = typeof type === "string" ? { type } : type;
    const defaultValue = resolvedValue.defaultValue || null;
    const self = this;
    self.options[name] = {
      type: resolvedValue.type,
      defaultValue,
      description: resolvedValue.description,
      alias: resolvedValue.alias
    };
    logger.debug(`Added option: ${name} - Type: ${resolvedValue.type}, Default: ${defaultValue}`);
    return self;
  }
  execute(executorFn) {
    logger.debug(`Setting execute handler for command: ${this.command}`);
    const self = this;
    return {
      command: this.command,
      description: this.description ?? null,
      options: this.options,
      async execute(args) {
        logger.debug(`Executing command: ${self.command} with args:`, args);
        await executorFn?.(args);
      }
    };
  }
}

const defineCommand = (name, description) => {
  logger.debug(`Defining command: ${name}`);
  return new Command(name, description);
};
const commands = [import('./commands/dev.DZn2eKrs.js')];

const version = "0.0.0-dev.0";

class Commands {
  constructor(commands) {
    this.commands = commands;
    logger.debug("Commands initialized.");
  }
  async executeCommands(args = hideBin(process.argv)) {
    logger.debug("Executing commands with args:", { args });
    const argv = yargs();
    const commandObjects = await Promise.all(this.commands);
    const commands = commandObjects.flatMap((obj) => Object.values(obj)).map((cmdOrObj) => cmdOrObj instanceof Command ? cmdOrObj.execute() : cmdOrObj);
    for (const cmd of commands) {
      const { options, description, command: commandStr, execute } = cmd;
      logger.debug(`Registering command: ${commandStr}`);
      argv.command(
        commandStr,
        description || "",
        (yargs2) => {
          for (const [optionName, optionDetails] of Object.entries(options)) {
            const { type, defaultValue, alias, description: description2 } = optionDetails;
            logger.debug(
              `Adding option to command '${commandStr}': ${optionName} (${type})${alias ? ` aliased to ${alias}` : ""}`
            );
            yargs2.option(optionName, {
              type,
              alias,
              description: description2,
              default: defaultValue ?? void 0
            });
          }
          return yargs2.version(false).help().alias("help", "h");
        },
        async ({ _, $0, ...args2 }) => {
          logger.debug(`Command '${commandStr}' called with args:`, args2);
          try {
            logger.debug(`Executing command '${commandStr}' with args:`, args2);
            await execute(args2);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        }
      );
    }
    const commandArgs = args.map((arg) => arg.replace(/(?<!-)-\w/g, (m) => m.slice(1).toUpperCase()));
    await argv.scriptName("fluxora").usage("$0 <command> [args]").help().alias("help", "h").version(version).alias("version", "v").strict().demandCommand(1, "You need to call one of the given commands or options.").parse(commandArgs);
  }
}

const cli = async () => {
  logger.debug("Initializing CLI...");
  const commands$1 = new Commands(commands);
  await commands$1.executeCommands();
};

export { cli, defineCommand as d, logger as l };
//# sourceMappingURL=fluxora.cli.js.map
