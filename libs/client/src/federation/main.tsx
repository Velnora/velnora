import type { RemoteApp } from "@fluxora/types/federation";

import { methodEnsure } from "./method-ensure";
import { remotes } from "./remotes";

declare global {
  var __remotes: RemoteApp[];
}

export const __federation_get_remote = async (name: string, componentName: string) => {
  const remote = await methodEnsure(name);
  if (!remote) {
    console.log(name, remote, componentName);
  }
  // const factory = await remote?.get(componentName);
  // return factory();

  return <></>;
};

export const __federation_setRemote = (remoteName: string, remoteConfig: RemoteApp) => {
  remotes[remoteName] = remoteConfig;
};

export { methodEnsure as __federation_ensure };

export { wrapDefault as __federation_wrap_default } from "./wrap-default";
export { unwrapDefault as __federation_unwrap_default } from "./unwrap-default";
