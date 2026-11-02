import { isWrapperOptionValue } from "./is-wrapper-option-value.mjs";

/**
 * `command` takes only `-p`: `command -v git` and `command -V git` look git up instead of running it.
 */
export const skipWrapperOptions = (words, start, wrapper) => {
  if (wrapper === "command") {
    return words[start] === "-p" ? start + 1 : start;
  }

  let index = start;
  while (words[index]?.startsWith("-")) {
    index++;
    if (isWrapperOptionValue(words[index])) {
      index++;
    }
  }

  return index;
};
