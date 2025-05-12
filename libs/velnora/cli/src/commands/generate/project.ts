import { type InferArgs, defineCommand } from "@velnora/cli-helper";
import { newProject } from "@velnora/generator";

export const project = defineCommand("project", "Create a new Velnora project")
  .positional("name", "The root directory of the app", { required: true })
  .option("scope", { type: "string", alias: "s", description: "The package name of the app" })
  .option("apps-dir", { type: "string", alias: "a", description: "The directory where the apps are located" })
  .option("libs-dir", { type: "string", alias: "l", description: "The directory where the libs are located" })
  .option("template-dir", { type: "string", alias: "t", description: "The directory where the template is located" })
  .option("prettier", { type: "boolean", alias: "p", description: "Add prettier to the project" })
  .option("sort-imports-plugin", {
    type: "boolean",
    description: "Add sort plugin to the project",
    requires: "prettier"
  })
  .option("package-json-plugin", {
    type: "boolean",
    description: "Add package json plugin to the project",
    requires: "prettier"
  })
  .option("eslint", { type: "boolean", description: "Add eslint to the project" })
  .execute(newProject);

export type GenerateProjectCommandOptions = InferArgs<typeof project>;
