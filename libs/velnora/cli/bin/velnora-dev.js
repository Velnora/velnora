#!/usr/bin/env node
import { resolve } from "node:path";

import { PROJECT_CWD, runScript, ssrEnv } from "../../../../scripts/vite-node-runner.js";

await runScript(async () => {
  await ssrEnv.runner.import(resolve(PROJECT_CWD, "libs/velnora/cli/bin/velnora.js"));
});
