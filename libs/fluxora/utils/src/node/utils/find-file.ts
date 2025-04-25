import { resolve } from "node:path";

import { glob } from "glob";

export const findFile = (root: string, file: string, extensions: string[]) => {
  const files = glob.sync(resolve(root, `${file}.{${extensions.join(",")}}`), { posix: true, cwd: root });
  if (files.length > 1) {
    throw new Error(`Multiple files found for ${file}. Please keep only one entry file.`);
  } else if (files.length === 0) {
    return;
  }
  return resolve(root, files[0]).replace(/\\/g, "/");
};
