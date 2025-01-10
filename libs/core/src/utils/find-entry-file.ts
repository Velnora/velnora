import { glob } from "glob";

export const findEntryFile = (root: string, entryName: string, extensions: string[]) => {
  const files = glob.sync(`${root}/src/${entryName}.{${extensions.join(",")}}`);
  if (files.length > 1) {
    throw new Error(`Multiple entry files found for ${entryName}. Please keep only one entry file.`);
  } else if (files.length === 0) {
    throw new Error(`No entry file found for ${entryName}. Please create an entry file.`);
  }
  return files[0];
};
