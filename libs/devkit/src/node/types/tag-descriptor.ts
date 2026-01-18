import type { HtmlTagDescriptor } from "vite";

export interface TagDescriptor extends Omit<HtmlTagDescriptor, "tag" | "children"> {
  children?: string | TagDescriptor[];
}
