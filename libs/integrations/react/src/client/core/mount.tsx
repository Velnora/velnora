import type { JSX } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import type { MountOptions } from "../types/mount-options";

export const mount = (element: JSX.Element, options: MountOptions) => {
  if (options.mode === "ssr") {
    hydrateRoot(document, element);
    return;
  }

  const container = document.querySelector(options.selector);
  if (!container) {
    throw new Error(`velnora/react: Cannot find root container "${options.selector}" to mount the app.`);
  }

  const root = createRoot(container);
  root.render(element);
};
