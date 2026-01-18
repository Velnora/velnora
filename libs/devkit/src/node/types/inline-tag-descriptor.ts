import type { TagDescriptor } from "./tag-descriptor";

export interface InlineTagDescriptor extends Pick<TagDescriptor, "attrs" | "children"> {
  content: string;
}
