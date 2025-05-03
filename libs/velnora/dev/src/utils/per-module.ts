import type { Promisable } from "type-fest";

export const perModule = async <TModule>(modules: Iterable<TModule>, cb: (module: TModule) => Promisable<void>) => {
  for (const module of modules) {
    await cb(module);
  }
};
