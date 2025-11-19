import type { ComponentType, PropsWithChildren } from "react";

export interface ReactIntegrationOptions {
  strictMode?: boolean;
  errorBoundary?: ComponentType<PropsWithChildren>;
  hydrate?: boolean; // future SSR
}
