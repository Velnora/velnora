import type { PluginOption } from "vite";

import react from "@vitejs/plugin-react-swc";

export const plugins: PluginOption = [react({ tsDecorators: true })];
