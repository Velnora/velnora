import { resolve } from "node:path";

import { stringConstructor } from "../../client";
import { fileActions } from "./file-actions";

export const pathConstructor = stringConstructor.new("/", { fs: path => fileActions(path) }, resolve);
