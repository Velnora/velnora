import { Command, type inferCommandType } from "@velnora/cli-helper";

const program = Command.create();

program.name("velnora").description("Velnora CLI").version("0.1.0");

const _devCommand = program
  .command("dev")
  .option("--host <string>", { description: "Host to run the development server on" })
  .option("--port <number>, -p", { description: "Port to run the development server on" })
  .option("--watch, -w", { description: "Enable watch mode", default: false })
  .option("--mode <development|production>", { description: "Set the mode", default: "development" })
  .option("--root <string>", { description: "Root directory of the project", default: "." })
  .action(async opts => {
    // eslint-disable-next-line @nx/enforce-module-boundaries
    const { createDevServer } = await import("@velnora/core");
    await createDevServer(opts);
  });
export type DevCommandOptions = inferCommandType<typeof _devCommand>;

const _previewCommand = program
  .command("preview")
  .option("--port <number>, -p", { description: "Port to run the preview server on", default: 5000 })
  .action(async opts => {
    // eslint-disable-next-line @nx/enforce-module-boundaries
    const { createPreviewServer } = await import("@velnora/core");
    await createPreviewServer(opts);
  });
export type PreviewCommandOptions = inferCommandType<typeof _previewCommand>;

program.command("build").action(async () => {
  // const { buildAll } = await import("./tasks/build.js");
  // await buildAll();
});

program.command("inspect").action(async () => {
  // const { printGraph } = await import("./tasks/inspect.js");
  // await printGraph();
});

await program.parseAsync();
