import { Program, type inferCommandType } from "@velnora/cli-helper";
import type { RequiredKeys } from "@velnora/types";

export const program = Program.createProgram();

program.name("velnora").description("Velnora CLI").version("0.1.0");

export const initCommand = program.command("init").description("Create a new Velnora workspace.");

export const devCommand = program
  .command("dev")
  .description("Start the development server in watch mode.")
  .option("--host <string>", { description: "Host to run the development server on" })
  .option("--port <number>, -p", { description: "Port to run the development server on" })
  .option("--watch, -w", { description: "Enable watch mode", default: false })
  .option("--mode <development|production>", { description: "Set the mode", default: "development" })
  .option("--root <string>", { description: "Root directory of the project", default: "." });

export type DevCommandOptions = RequiredKeys<inferCommandType<typeof devCommand>, "host" | "port">;

export const buildCommand = program
  .command("build")
  .description("Build the current project or workspace for production.");

export const listCommand = program.command("list").description("List all discovered projects in the workspace.");

export const graphCommand = program.command("graph").description("Display the dependency graph of the workspace.");

export const doctorCommand = program
  .command("doctor")
  .description("Check for issues with configuration and environment.");
