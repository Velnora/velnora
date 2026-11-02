import { fencedLineVisibility } from "./fenced-line-visibility";

export const maskFencedCode = (source: string) => {
  const visible = fencedLineVisibility(source, { markdownFencesVisible: false });
  return source
    .split("\n")
    .map((line, index) => (visible[index] ? line : line.replace(/[^\r]/g, " ")))
    .join("\n");
};
