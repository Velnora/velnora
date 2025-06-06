import { TuiLogger } from "@velnora/logger";

const tui = await TuiLogger.instance();
tui.addTab("velnora");
tui.addItem("velnora", "Velnora");

export const logger = tui.container("velnora", "Velnora");
