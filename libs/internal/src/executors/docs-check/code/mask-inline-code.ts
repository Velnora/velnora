export const maskInlineCode = (source: string) => {
  const characters = [...source];
  let index = 0;
  while (index < characters.length) {
    if (characters[index] !== "`") {
      index++;
      continue;
    }
    const start = index;
    while (characters[index] === "`") {
      index++;
    }
    const length = index - start;
    let end = index;
    while (end < characters.length) {
      if (characters[end] !== "`") {
        end++;
        continue;
      }
      const close = end;
      while (characters[end] === "`") {
        end++;
      }
      if (end - close !== length) {
        continue;
      }
      for (let position = start; position < end; position++) {
        if (characters[position] !== "\r" && characters[position] !== "\n") {
          characters[position] = " ";
        }
      }
      index = end;
      break;
    }
  }
  return characters.join("");
};
