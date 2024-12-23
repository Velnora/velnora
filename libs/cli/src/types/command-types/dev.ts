import type { InferArgs } from "@fluxora/cli";

import type { dev } from "../../commands/dev";

export type DevCommandArgs = InferArgs<typeof dev>;
