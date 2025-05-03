import { build as internalBuild } from "../core/build";

export const build = async () => {
  await internalBuild();
};
