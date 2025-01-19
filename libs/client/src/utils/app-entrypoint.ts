import { name } from "/@fluxora/virtual/entry/app-config";
import * as APP from "/@fluxora/virtual/entry/react/app";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const componentName = capitalize(name);
const __importName = [componentName, "App", "default"].find(e => e in APP);
export const App = __importName
  ? APP[__importName as keyof typeof APP]
  : () => {
      throw new Error(`App ${componentName} not found`);
    };
