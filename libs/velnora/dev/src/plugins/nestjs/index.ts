import type { PluginOption } from "vite";

import { RegisteredApp } from "@velnora/runtime";

import { nestjsServePlugin } from "./nestjs-serve.plugin";

export const nestjsPlugin = (app: RegisteredApp): PluginOption => {
  return [nestjsServePlugin(app)];
};
