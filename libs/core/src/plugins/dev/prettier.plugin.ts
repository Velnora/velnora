import { format, resolveConfig, resolveConfigFile } from "prettier";
import type { Plugin } from "vite";

export const prettierPlugin = async (): Promise<Plugin> => {
  const configFile = await resolveConfigFile();
  const config = configFile ? await resolveConfig(configFile) : {};

  return {
    name: "fluxora:dev-plugins:prettier",
    enforce: "post",

    apply(_, env) {
      return env.mode === "development";
    },

    transformIndexHtml: {
      order: "post",
      handler(html) {
        return format(html, { parser: "html", ...config });
      }
    }
  };
};
