import { App as NoopApp } from "/@fluxora/virtual/entry/react/noop";
import * as TEMPLATE from "/@fluxora/virtual/entry/react/template";

const __importName = ["Template", "App", "default"].find(e => e in TEMPLATE);
export const App = __importName ? TEMPLATE[__importName as keyof typeof TEMPLATE] : NoopApp;
