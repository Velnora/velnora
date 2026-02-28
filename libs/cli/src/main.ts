/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/cli
 * layer: tooling
 * visibility: public
 */
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

import { handleInit } from "./handlers/init";

initCommand.action(options => {
  handleInit(options.cwd || process.cwd());
});

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
