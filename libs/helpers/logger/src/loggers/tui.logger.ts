import { ClassExtensions, singleton } from "@velnora/utils";

import { GroupLogger } from "./group.logger";

@ClassExtensions()
class TuiLogger extends GroupLogger {
  override addLog(group: string, level: string, ...args: any[]) {
    // the same way how doin super.addLog but this time rendering gonna be different renderer.
    // ofc its going be implemented in rust side.
  }
}

export const tuiLogger = singleton(TuiLogger);
