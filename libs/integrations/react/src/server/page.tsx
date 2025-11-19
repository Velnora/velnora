import type { ComponentType } from "react";
import { renderToPipeableStream } from "react-dom/server";

// import type { Result } from "@velnora/runtime-server";

export const page = (Component: ComponentType) => {
  // const renderedResult = renderToPipeableStream(<Component />, {});
  return { html: /*renderedResult*/ "" };
};
