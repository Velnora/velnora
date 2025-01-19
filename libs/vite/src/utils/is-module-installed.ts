import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const isModuleInstalled = (module: string) => {
  try {
    require.resolve(module);
    return true;
  } catch (error) {
    return false;
  }
};
