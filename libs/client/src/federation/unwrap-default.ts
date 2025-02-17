import type { RemoteLibrary } from "@fluxora/types/federation";

export const unwrapDefault = (module: RemoteLibrary) => {
  return module?.__esModule || module?.[Symbol.toStringTag] === "Module" ? module.default : module;
};
