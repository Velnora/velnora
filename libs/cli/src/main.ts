import { dirname } from "node:path";

import {
  buildCommand,
  devCommand,
  doctorCommand,
  graphCommand,
  initCommand,
  listCommand,
  program
} from "@velnora/commands";
import { initWorkspace } from "@velnora/generator";
import { createKernel } from "@velnora/kernel";

initCommand.action(options => {
  const cwd = options.cwd || process.cwd();
  const result = initWorkspace(cwd);
  const status = result.status === "created" ? "Initialized workspace" : "Already initialized";
  console.info(`[Velnora] ${status}: ${dirname(result.configPath)}`);
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
