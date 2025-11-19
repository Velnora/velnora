#!/usr/bin/env vite-node
import { createRequire } from "node:module";
import { resolve } from "node:path";

// eslint-disable-next-line @nx/enforce-module-boundaries
import { run } from "../../../scripts/vite-node-runner.ts";

const require = createRequire(import.meta.url);
const file = require.resolve("@velnora/cli/package.json");
const resolvedFile = resolve(file, "../bin/velnora-dev.ts");
await run(resolvedFile);
