const QUOTES = ["'", '"'];
const WHITESPACE = /\s/;

export const splitShellWords = segment => {
  const words = [];
  let word = null;
  let openQuote = null;

  for (const char of segment) {
    if (openQuote !== null) {
      if (char === openQuote) {
        openQuote = null;
      } else {
        word += char;
      }
      continue;
    }

    if (QUOTES.includes(char)) {
      openQuote = char;
      word ??= "";
      continue;
    }

    if (!WHITESPACE.test(char)) {
      word = (word ?? "") + char;
      continue;
    }

    if (word !== null) {
      words.push(word);
      word = null;
    }
  }

  if (word !== null) {
    words.push(word);
  }

  return words;
};
