import { commandName } from "./command-name.mjs";
import { COMMAND_WRAPPERS } from "./command-wrappers.mjs";
import { skipWrapperOptions } from "./skip-wrapper-options.mjs";

const ASSIGNMENT = /^[A-Za-z_]\w*=/;

export const skipCommandPrefixes = words => {
  let index = 0;
  let readsArgsFromStdin = false;

  while (index < words.length) {
    if (ASSIGNMENT.test(words[index])) {
      index++;
      continue;
    }

    const wrapper = commandName(words[index]);
    if (!COMMAND_WRAPPERS.has(wrapper)) {
      break;
    }
    if (wrapper === "xargs") {
      readsArgsFromStdin = true;
    }
    index = skipWrapperOptions(words, index + 1, wrapper);
  }

  return { commandIndex: index, readsArgsFromStdin };
};
