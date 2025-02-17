import type { ReactNode } from "react";
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server";

import { EntryApp } from "./entry-app";

export const renderPipeableStream = (element: ReactNode, options: RenderToPipeableStreamOptions) =>
  renderToPipeableStream(<EntryApp>{element}</EntryApp>, options);
