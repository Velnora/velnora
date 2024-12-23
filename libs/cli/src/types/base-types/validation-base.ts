import type { DevCommandArgs } from "../command-types/dev";

export interface ValidationBase extends Pick<DevCommandArgs, "noValidate" | "auto"> {}
