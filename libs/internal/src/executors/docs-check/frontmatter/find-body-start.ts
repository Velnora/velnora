export const findBodyStart = (lines: string[]) => {
  if (lines[0] !== "---") {
    return 0;
  }
  const close = lines.indexOf("---", 1);
  return close < 0 ? 0 : close + 1;
};
