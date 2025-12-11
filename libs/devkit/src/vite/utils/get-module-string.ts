export const getModuleString = (modulePath: string, names: string[]) => {
  const exportedNames = Array.from(new Set([...names, "default"]));

  return `
import { getModule } from "@velnora/devkit";
import * as __module from "${modulePath}";

export default getModule(__module, [${exportedNames.map(name => `"${name}"`).join(", ")}]);
`;
};
