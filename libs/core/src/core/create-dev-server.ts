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

  const velnora = createServer(mergedConfig);
  await parseInfra(velnora.graph);
  await Promise.all(
    Array.from(velnora.graph.nodes).map(async node => {
      const meta = velnora.graph.nodeMeta.get(node)!;
      await meta.package.fetchConfig();
    })
  );
  await velnora.graph.perNode((_, node) => velnora.integrationContainer.configure(node.package));

  await velnora.injectModules();
  await velnora.listen();
  const endTime = performance.now();
  velnora.printUrls(endTime - startTime);

  velnora.http.on("close", () => vite.close());
};
