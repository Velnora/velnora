import type { RemoteLibrary } from "@fluxora/types/federation";

import { get } from "./get";
import { loadJS } from "./load-js";
import { remotes } from "./remotes";
import { wrapShareScope } from "/@fluxora/virtual/entry/federation/externals";

declare global {
  interface Window {
    [key: string]: RemoteLibrary;
  }
}

export const methodEnsure = async (remoteId: string) => {
  const remote = remotes[remoteId];
  if (remote.inited) {
    const promise = Promise.withResolvers<RemoteLibrary | undefined>();
    promise.resolve(remote.lib);
    return promise.promise;
  }

  if ("var" === remote.format) {
    const promise = Promise.withResolvers<RemoteLibrary | undefined>();

    await loadJS(remote.url, () => {
      if (!remote.inited) {
        remote.lib = window[remoteId]!;
        remote.lib.init(wrapShareScope(remote.from));
        remote.inited = true;
      }
      promise.resolve(remote.lib);
    });

    return promise.promise;
  } else if ((["esm", "systemjs"] as const).includes(remote.format)) {
    const promise = Promise.withResolvers<RemoteLibrary | undefined>();
    const getUrl = typeof remote.url === "function" ? remote.url : () => Promise.resolve(remote.url);
    const url = await getUrl();
    try {
      const lib = (await get(url, remote.from))();

      if (!remote.inited) {
        const shareScope = wrapShareScope(remote.from);
        lib.init(shareScope);
        remote.lib = lib;
        remote.lib.init(shareScope);
        remote.inited = true;
      }
      promise.resolve(remote.lib);

      return promise.promise;
    } catch (e) {
      promise.reject(e);
    }
  } else {
    throw new Error(`Unsupported format: ${remote.format}`);
  }
};
