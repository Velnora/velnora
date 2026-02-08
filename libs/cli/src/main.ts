import {
  buildCommand,
  devCommand,
  doctorCommand,
  graphCommand,
  initCommand,
  listCommand,
  program
} from "@velnora/commands";
import { findProjects, findWorkspaceRoot } from "@velnora/utils";

initCommand.action(async () => {});

devCommand.action(async () => {
  const workspaceRoot = await findWorkspaceRoot(process.cwd());
  const projects = await findProjects(workspaceRoot);

  console.log(projects);
});

buildCommand.action(async () => {});

listCommand.action(async () => {});

graphCommand.action(async () => {});

doctorCommand.action(async () => {});

await program.parseAsync();
