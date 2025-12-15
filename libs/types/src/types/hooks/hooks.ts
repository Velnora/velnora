import type { IntegrationContainerHooks } from "../../integration";
import type { LoggerHooks } from "./logger-hooks";

export interface Hooks extends IntegrationContainerHooks, LoggerHooks {}
