import type { PartialDeep } from "type-fest";

import type { FluxoraAppConfig } from "./fluxora-app-config";

export interface PartialFluxoraAppConfig extends PartialDeep<FluxoraAppConfig> {}
