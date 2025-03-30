import { resolve } from "node:path";

import { fileActions } from "./file-actions";
import { stringConstructor } from "./string-constructor";

export const pathConstructor = stringConstructor.new("/", { fs: path => fileActions(path) }, resolve);
