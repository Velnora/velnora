import { resolve } from "node:path";

import MagicString from "magic-string";
import type { Plugin } from "vite";

import type { VelnoraConfig } from "@velnora/types";

export const virtualModulePlugin = (config: VelnoraConfig, virtualModules: Map<string, string>): Plugin => {
  const idFileMapping = new Map<string, string>();

  return {
    name: "velnora:virtual",
    enforce: "pre",

    resolveId(id) {
      if (virtualModules.has(id)) {
        const module = resolve(id.replace(/^\//, ""));
        idFileMapping.set(module, id);
        return module;
      }
    },

    load(id) {
      if (idFileMapping.has(id)) {
        const identifier = idFileMapping.get(id)!;
        const code = virtualModules.get(identifier)!;
        const msCode = new MagicString(code);
        const protocolId = identifier.startsWith(config.cacheDir)
          ? identifier.slice(config.cacheDir.length + 1)
          : identifier;
        const source = protocolId.startsWith("velnora:") ? `/${protocolId.slice("velnora:".length)}` : protocolId;

        return {
          code: msCode.toString(),
          map: msCode.generateMap({ hires: true, source: `velnora://${source}`, includeContent: true })
        };
      }
    }
  };
};
