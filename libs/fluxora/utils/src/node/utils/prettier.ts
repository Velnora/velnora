import { type BuiltInParserName, type Config, resolveConfig, resolveConfigFile } from "prettier";

export let prettierConfig: Config = {};
const configFile = await resolveConfigFile();
if (configFile) {
  prettierConfig = (await resolveConfig(configFile)) || {};
}

export const fileToParser: Partial<Record<string, BuiltInParserName>> = {
  "js": "babel",
  "cjs": "babel",
  "mjs": "babel",
  "jsx": "babel",
  "ts": "babel-ts",
  "mts": "babel-ts",
  "cts": "babel-ts",
  "tsx": "babel-ts",
  "json": "json",
  "jsonc": "json",
  "md": "markdown",
  "markdown": "markdown",
  "html": "html",
  "css": "css",
  "scss": "scss",
  "yaml": "yaml",
  "yml": "yaml",
  ".prettierrc": "json"
};
