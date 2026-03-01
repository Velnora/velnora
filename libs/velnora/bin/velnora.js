#!/usr/bin/env node
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);

const cliPkgPath = require.resolve("@velnora/cli/package.json");
const cliPath = resolve(dirname(cliPkgPath), "bin/velnora.js");
try {
  await import(cliPath);
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
