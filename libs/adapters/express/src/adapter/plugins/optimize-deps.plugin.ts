import { Plugin, defineConfig } from "vite";

export const optimizeDepsPlugin = (): Plugin => {
  return {
    name: "@velnora/adapter-express:optimize-deps",

    config() {
      return defineConfig({
        optimizeDeps: { include: ["reflect-metadata", "@nestjs/common"] }
      });
    }
  };
};
