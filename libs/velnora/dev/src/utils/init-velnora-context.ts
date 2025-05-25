import { createHooks } from "hookable";

import { velnoraCtx } from "@velnora/utils/node";

export const initVelnoraContext = () => {
  velnoraCtx.set({ hooks: createHooks() });
};
