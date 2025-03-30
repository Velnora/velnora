import { resolve } from "node:path";

import { glob } from "glob";

export const findEntryFile = (root: string, entryName: string, extensions: string[]) => {
  const files = glob.sync(resolve(root, "src", `${entryName}.{${extensions.join(",")}}`), { posix: true, cwd: root });
  if (files.length > 1) {
    throw new Error(`Multiple entry files found for ${entryName}. Please keep only one entry file.`);
  } else if (files.length === 0) {
    throw new Error(`No entry file found for ${entryName}. Please create an entry file.`);
  }
  return resolve(root, files[0]).replace(/\\/g, "/");
};
