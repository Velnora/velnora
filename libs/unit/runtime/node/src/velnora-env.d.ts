import type { JavaScriptRuntime } from "./types/javascript-runtime";

declare global {
  namespace Velnora {
    interface UnitRegistry {
      javascript: JavaScriptRuntime;
      node: JavaScriptRuntime;
    }
  }
}
