import type { JSX } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import type { MountOptions } from "../types/mount-options";

export const mount = (element: JSX.Element, options: MountOptions) => {
  const container = options.selector ? document.querySelector(options.selector)! : document;
  if (!container) {
    throw new Error(`velnora/react: Cannot find root container "${options.selector}" to mount the app.`);
  }

  if (options.mode === "ssr") {
    console.log("Hydrating in SSR mode");
    hydrateRoot(container, element);
    return;
  }

  console.log("Mounting in CSR mode");
  const root = createRoot(container);
  root.render(element);
};
