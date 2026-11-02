const PATH_SEPARATOR = /[\\/]/;

export const commandName = word => {
  return word
    .split(PATH_SEPARATOR)
    .pop()
    .replace(/\.exe$/, "");
};
