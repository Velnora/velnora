import {
  buildCommand,
  devCommand,
  doctorCommand,
  graphCommand,
  initCommand,
  listCommand,
  program
} from "@velnora/commands";
import { detectProjects, detectWorkspace } from "@velnora/utils";

initCommand.action(async () => {});

devCommand.action(async () => {
  const workspace = await detectWorkspace(process.cwd());
  const projects = await detectProjects(workspace.root, workspace.rootPackageJson);

  console.log(projects);
});

buildCommand.action(async () => {});

listCommand.action(async () => {});

graphCommand.action(async () => {});

doctorCommand.action(async () => {});

await program.parseAsync();
