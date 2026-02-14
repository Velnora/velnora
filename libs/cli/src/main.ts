import {
  buildCommand,
  devCommand,
  doctorCommand,
  graphCommand,
  initCommand,
  listCommand,
  program
} from "@velnora/commands";
import { createKernel } from "@velnora/kernel";

initCommand.action(async () => {});

devCommand.action(async options => {
  const kernel = createKernel();
  await kernel.init();
  await kernel.bootHost(options);
});

buildCommand.action(async () => {});

listCommand.action(async () => {});

graphCommand.action(async () => {});

doctorCommand.action(async () => {});

await program.parseAsync();
