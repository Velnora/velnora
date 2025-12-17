import { buildCommand, devCommand, inspectCommand, previewCommand, program } from "@velnora/commands";

devCommand.action(async opts => {
  const { createDevServer } = await import("@velnora/runtime-server");
  const velnora = await createDevServer(opts);
  await velnora.listen();
  velnora.printUrls();
});

previewCommand.action(async opts => {
  const { createPreviewServer } = await import("@velnora/runtime-server");
  await createPreviewServer(opts);
});

buildCommand.action(async () => {
  // const { buildAll } = await import("./tasks/build.js");
  // await buildAll();
});

inspectCommand.action(async () => {
  // const { printGraph } = await import("./tasks/inspect.js");
  // await printGraph();
});

await program.parseAsync();
