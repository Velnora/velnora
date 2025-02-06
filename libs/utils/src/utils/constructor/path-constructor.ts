import { fileActions } from "./file-actions";
import { stringConstructor } from "./string-constructor";

export const pathConstructor = stringConstructor.new("/", {
  f: path => fileActions(path)
});
