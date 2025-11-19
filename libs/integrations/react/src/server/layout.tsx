import type { ComponentType, PropsWithChildren } from "react";
import { renderToPipeableStream } from "react-dom/server";

// import type { Result } from "@velnora/runtime-server";

export const layout = (Component: ComponentType<PropsWithChildren>) => {
  // const renderedResult = renderToPipeableStream(<Component />, {});
  return { html: /*renderedResult*/ "" };
};
