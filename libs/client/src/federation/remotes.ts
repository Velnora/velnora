import type { RemoteApp } from "@fluxora/types/federation";

export const remotes = globalThis.__remotes.reduce(
  (acc, remoteApp) => ({ ...acc, [remoteApp.name]: remoteApp }),
  {} as Record<string, RemoteApp>
);
