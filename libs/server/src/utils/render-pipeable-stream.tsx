import { type RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server";

import { EntryApp } from "/@fluxora/client-server/react";

export const renderPipeableStream = (options: RenderToPipeableStreamOptions) => {
  return renderToPipeableStream(<EntryApp />, options);
};
