import { Command, type inferCommandType } from "@velnora/cli-helper";

export const program = Command.create();

program.name("velnora").description("Velnora CLI").version("0.1.0");

export const devCommand = program
  .command("dev")
  .option("--host <string>", { description: "Host to run the development server on" })
  .option("--port <number>, -p", { description: "Port to run the development server on" })
  .option("--watch, -w", { description: "Enable watch mode", default: false })
  .option("--mode <development|production>", { description: "Set the mode", default: "development" })
  .option("--root <string>", { description: "Root directory of the project", default: "." });

export type DevCommandOptions = inferCommandType<typeof devCommand>;

export const previewCommand = program
  .command("preview")
  .option("--port <number>, -p", { description: "Port to run the preview server on", default: 5000 });

export type PreviewCommandOptions = inferCommandType<typeof previewCommand>;

export const buildCommand = program.command("build");

export const inspectCommand = program.command("inspect");
