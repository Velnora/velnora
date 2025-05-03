import type { HtmlTagDescriptor } from "vite";

export type Inject = HtmlTagDescriptor | { html: string; injectTo: HtmlTagDescriptor["injectTo"] };
