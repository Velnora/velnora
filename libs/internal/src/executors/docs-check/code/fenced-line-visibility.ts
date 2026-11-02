import type { FencedLineVisibilityOptions } from "./fenced-line-visibility-options";

export const fencedLineVisibility = (source: string, { markdownFencesVisible }: FencedLineVisibilityOptions) => {
  let marker = "";
  let length = 0;
  let markdown = false;
  return source.split(/\r?\n/).map(line => {
    const fence = line.trimStart().match(/^(`{3,}|~{3,})(.*)$/);
    const fenceMarker = fence?.[1] ?? "";
    const info = fence?.[2]?.trim() ?? "";
    if (marker) {
      if (fence && fenceMarker.startsWith(marker) && fenceMarker.length >= length && !info) {
        marker = "";
        return false;
      }
      return markdownFencesVisible && markdown;
    }
    if (fence) {
      marker = fenceMarker.charAt(0);
      length = fenceMarker.length;
      markdown = ["md", "markdown"].includes(info);
      return false;
    }
    return true;
  });
};
