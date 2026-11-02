import { maskFencedCode } from "./mask-fenced-code";
import { maskInlineCode } from "./mask-inline-code";

export const maskCode = (source: string) => maskInlineCode(maskFencedCode(source));
