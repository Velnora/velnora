import type { Promisable } from "type-fest";

import type { Integration } from "@velnora/schemas";

export function defineIntegration(integration: () => Integration): () => Integration;
export function defineIntegration<TOptions>(
  integration: (options?: TOptions) => Integration
): (options?: TOptions) => Integration;
export function defineIntegration(integration: Integration): Integration;
export function defineIntegration(integration: Integration | ((options?: unknown) => Promisable<Integration>)) {
  return integration;
}
