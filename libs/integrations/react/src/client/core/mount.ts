import type { JSX } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import type { MountOptions } from "../types/mount-options";

export const mount = (element: JSX.Element, options: MountOptions) => {
  const container =
    typeof options.selector === "string"
      ? document.querySelector(options.selector)!
      : typeof options.selector === "object"
        ? options.selector
        : document;
  if (!container) {
    const selector =
      typeof options.selector === "string"
        ? options.selector
        : typeof options.selector === "object"
          ? "document"
          : "undefined";
    throw new Error(`velnora/react: Cannot find root container "${selector}" to mount the app.`);
  }

  if (options.mode === "ssr") {
    console.log("Hydrating in SSR mode");
    hydrateRoot(container, element, {
      identifierPrefix: "_velnora_react_",
      onUncaughtError: console.error.bind(console, "onUncaughtError:"),
      onCaughtError: console.error.bind(console, "onCaughtError:"),
      onRecoverableError: console.error.bind(console, "onRecoverableError:")
    });
    return;
  }

  console.log("Mounting in CSR mode");
  const root = createRoot(container);
  root.render(element);
};
