import { getContext } from "unctx";

import type { VelnoraContext } from "@velnora/types";

export const velnoraCtx = getContext<VelnoraContext>("velnora");

export const useVelnora = () => {
  const context = velnoraCtx.tryUse();
  if (!context) {
    // ToDo: handle error
    throw new Error("Velnora context is not available. Make sure to use it within a Velnora application context.");
  }
  return context;
};

export const useVelnoraSilent = () => velnoraCtx.tryUse();
