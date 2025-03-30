import { type FC, type ReactNode, StrictMode } from "react";

import { EntryApp } from "@fluxora/framework-react";
import { ErrorCodes, VIRTUAL_ENTRIES, appCtx, exceptionManager } from "@fluxora/utils";

import { renderWithInjection } from "../utils/render-with-injectables";

export const render = async (path: string) => {
  const appName = appCtx.projectStructure.apps.getAppByPath(path);
  let jsx: ReactNode | null = null;
  let src: string | null = null;
  if (appName) {
    try {
      const { default: PageApp } = await appCtx.vite.loadModule<{ default: FC }>(VIRTUAL_ENTRIES.APP(appName));
      jsx = <PageApp />;
      src = VIRTUAL_ENTRIES.PAGE_JS(appName);
    } catch (e) {
      exceptionManager.handleError(e, [ErrorCodes.ERR_MODULE_NOT_FOUND]);
    }
  }

  return renderWithInjection(
    <StrictMode>
      <EntryApp>{jsx}</EntryApp>
    </StrictMode>,
    { injections: src ? [{ tag: "script", attrs: { type: "module", src }, injectTo: "body" }] : [] }
  );
};
