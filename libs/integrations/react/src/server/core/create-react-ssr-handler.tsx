import type { ClientRoute } from "velnora/router";

import { type RenderFn, type SsrTarget, ssrTargetMode } from "@velnora/types";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { appDirSsrHandler } from "./app-dir-ssr-handler";
import { singleFileSsrHandler } from "./single-file-ssr-handler";

interface CreateReactSsrHandlerOptions extends Pick<SsrTarget, "mode"> {
  routes: ClientRoute<ReactRouteDescriptor>[];
}

export const createReactSsrHandler = (options: CreateReactSsrHandlerOptions): RenderFn => {
  return ctx => {
    const mode = options?.mode || ssrTargetMode.SINGLE_FILE;

    if (mode === ssrTargetMode.SINGLE_FILE) {
      return singleFileSsrHandler(options.routes[0]!)(ctx);
    }

    if (mode === ssrTargetMode.APP_DIR) {
      return appDirSsrHandler(options.routes)(ctx);
    }

    return { body: "Internal server error", status: 500 };
  };
};
