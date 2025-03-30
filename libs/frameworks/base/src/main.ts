import assert from "node:assert";

import type { PartialDeep } from "type-fest";
import type { PluginOption } from "vite";

export interface Framework {
  plugins?: PluginOption;
}

export const assertFramework = (framework: PartialDeep<Framework>) => {
  assert(framework, "Framework is required");
};
