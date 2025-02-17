import type { RemoteLibrary } from "@fluxora/types/federation";

export const wrapDefault = (module: RemoteLibrary, need: boolean) => {
  if (!module?.default && need) {
    let obj = Object.create(null);
    obj.default = module;
    obj.__esModule = true;
    return obj;
  }
  return module;
};
