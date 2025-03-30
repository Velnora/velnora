export const parseHttpDate = (date: string) => {
  const timestamp = date && Date.parse(date);
  return typeof timestamp === "number" ? timestamp : NaN;
};
