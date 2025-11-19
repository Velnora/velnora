import { resolve } from "node:path";

import type { DevCommandOptions } from "@velnora/cli";
import { type VelnoraConfig, velnoraConfigSchema } from "@velnora/schemas";
import { createServer, loadConfigFile, vite } from "@velnora/vite-integration";

import { mergeConfig } from "../utils/merge-config";
import { parseInfra } from "../utils/parse-infra";

export const createDevServer = async (options: DevCommandOptions) => {
  options.root = resolve(options.root);
  const startTime = performance.now();

  const config = await loadConfigFile<VelnoraConfig>(resolve(options.root, "velnora.config"));
  const parsedConfig = await velnoraConfigSchema.parseAsync(config);
  const mergedConfig = mergeConfig(options, parsedConfig);

  const velnora = await createServer(mergedConfig);
  await parseInfra(velnora.graph);
  velnora.graph.perNode((_, node) => velnora.integrationContainer.configure(node.package));

  // velnora.handleRequest(velnora.router.handleRequest.bind(velnora.router));

  await velnora.listen();
  const endTime = performance.now();
  velnora.printUrls(endTime - startTime);

  velnora.http.on("close", () => vite.close());
};
