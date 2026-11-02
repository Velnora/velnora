import type { DocsProblem } from "../docs-problem";
import { checkLinkTarget } from "./check-link-target";
import { collectLinkTargets } from "./collect-link-targets";

export const checkRelativeLinks = (root: string, file: string, masked: string) => {
  const problems: DocsProblem[] = [];
  for (const [index, line] of masked.split(/\r?\n/).entries()) {
    for (const target of collectLinkTargets(line)) {
      const message = checkLinkTarget(root, file, target);
      if (message) {
        problems.push({ file, line: index + 1, message });
      }
    }
  }
  return problems;
};
